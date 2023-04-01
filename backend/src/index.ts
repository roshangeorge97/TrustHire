import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import { Reclaim, generateUuid } from '@reclaimprotocol/reclaim-sdk'
import { Pool } from 'pg'
import cors from 'cors'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8000
const callbackUrl = process.env.CALLBACK_URL! + '/' + 'callback/'

app.use(express.json())
app.use(cors())

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
})

const reclaim = new Reclaim(callbackUrl)

const isValidRepo = (repoStr: string) => {
	return repoStr.indexOf('/') > -1 && repoStr.split('/').length === 2
}

app.get('/', (req: Request, res: Response) => {
	res.send('works!')
})

app.get('/home/repo', async (req: Request, res: Response) => {
	const { repo, email } = req.query
	if (!repo || !email) {
		res.status(400).send(`400 - Bad Request: repo and email are required`)
		return
	}
	const repoFullName = repo as string
	const emailStr = email as string

	if (!isValidRepo(repoFullName)) {
		res.status(400).send(`400 - Bad Request: invalid repository name`)
		return
	}

	const callbackId = 'repo-' + generateUuid()
	const template = (
		await reclaim.getConsent('Github-contributor', [
			{
				provider: 'github-contributor',
				params: {
					repo: repoFullName,
				},
			},
		])
	).generateTemplate(callbackId)
	const url = template.url
	const templateId = template.id

	try {
		await pool.query(
			'INSERT INTO submitted_links (callback_id, status, repo, email, template_id) VALUES ($1, $2, $3, $4)',
			[callbackId, 'pending', repoFullName, emailStr, templateId]
		)
	} catch (e) {
		res.status(400).send(`500 - Internal Server Error - ${e}`)
		return
	}

	res.json({ url, callbackId })
})

app.post('/callback/:id', async (req: Request, res: Response) => {
	if (!req.params.id) {
		res.status(400).send(`400 - Bad Request: callbackId is required`)
		return
	}

	const reqBody = JSON.parse(decodeURIComponent(req.body))

	if (!reqBody.claims || !reqBody.claims.length) {
		res.status(400).send(`400 - Bad Request: claims are required`)
		return
	}

	const callbackId = req.params.id
	const claims = { claims: reqBody.claims }

	try {
		const results = await pool.query(
			'SELECT callback_id FROM submitted_links WHERE callback_id = $1',
			[callbackId]
		)
		if (results.rows.length === 0) {
			res.status(404).send(`404 - Not Found: callbackId not found`)
			return
		}
	} catch (e) {
		res.status(500).send(`500 - Internal Server Error - ${e}`)
		return
	}

	try {
		await pool.query(
			'UPDATE submitted_links SET claims = $1, status = $2 WHERE callback_id = $3;',
			[JSON.stringify(claims), 'verified', callbackId]
		)
	} catch (e) {
		res.status(500).send(`500 - Internal Server Error - ${e}`)
		return
	}

	res.send(`<h3>Success!</h3>`)
})

app.get('/status/:callbackId', async (req: Request, res: Response) => {
	let statuses

	if (!req.params.callbackId) {
		res.status(400).send(`400 - Bad Request: callbackId is required`)
		return
	}

	const callbackId = req.params.callbackId

	try {
		const results = await pool.query(
			'SELECT callback_id FROM submitted_links WHERE callback_id = $1',
			[callbackId]
		)
		if (results.rows.length === 0) {
			res.status(404).send(`404 - Not Found: callbackId not found`)
			return
		}
	} catch (e) {
		res.status(500).send(`500 - Internal Server Error - ${e}`)
		return
	}

	try {
		statuses = await pool.query(
			'SELECT status FROM submitted_links WHERE callback_id = $1',
			[callbackId]
		)
	} catch (e) {
		res.status(500).send(`500 - Internal Server Error - ${e}`)
		return
	}

	res.json({ status: statuses?.rows[0]?.status })
})

process.on('uncaughtException', function (err) {
	console.log('Caught exception: ', err)
})

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`)
})
