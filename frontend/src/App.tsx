import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import { QRCodeSVG } from 'qrcode.react'
import Toaster from './components/Toaster'
import { toast } from 'react-hot-toast'
import { handleError } from './utils'
const getCallbackUrl = process.env.REACT_APP_BACKEND_BASE_URL + '/home'
const statusUrl = process.env.REACT_APP_BACKEND_BASE_URL + '/status'

type Inputs = {
	owner: string
	repo: string
}

function App() {
	const [callbackUrl, setCallbackUrl] = React.useState<string | null>(null)
	const [callbackId, setCallbackId] = React.useState<string | null>(null)
	const [status, setStatus] = React.useState<string | null>(null)
	const [loading, setLoading] = React.useState<boolean>(false)
	const [appUrl, setAppUrl] = React.useState<string | null>(null)

	const [input, setInput] = useState<Inputs>({
		owner: '',
		repo: '',
	})

	const getStatus = async (callbackId: string) => {
		const response = await axios.get(statusUrl + `/${callbackId}`)
		setStatus(response.data.status)
	}

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const repoFullName = input.owner + '/' + input.repo
		proveIt(repoFullName).catch((e) => console.log(handleError(e)))
	}

	const getCallback = async (repo: string) => {
		return toast.promise(
			axios.get(getCallbackUrl + '/repo', {
				params: { repo },
			}),
			{
				loading: 'Loading..',
				error: (error) => handleError(error),
				success: 'Success',
			}
		)
	}

	const proveIt = async (repo: string) => {
		const response = await getCallback(repo)
		setCallbackId(response.data.callbackId)
		setCallbackUrl(response.data.url)
		setLoading(true)
		setAppUrl(response.data.url)
	}

	useEffect(() => {
		if (!callbackId) return

		const interval = setInterval(() => {
			getStatus(callbackId)
		}, 2000)

		return () => clearInterval(interval)
	}, [callbackId])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}))
	}

	return (
		<>
			<div className="App">
				<header className="App-header bg-[#282c34]">
					<h1>Prove that you've contributed to a github repo</h1>

					{!callbackUrl ? (
						<>
							<form className="actions" onSubmit={onSubmit}>
								<input
									name="owner"
									required
									onChange={handleChange}
									placeholder="Organization name eg:questbook"
									value={input.owner}
									className="username-input"
								/>

								<input
									name="repo"
									required
									onChange={handleChange}
									placeholder="Repo name eg:reclaim-sdk"
									value={input.repo}
									className="username-input"
								/>

								<button type="submit" className="button" disabled={!!callbackUrl}>
									Claim it!
								</button>
							</form>
						</>
					) : (
						<div className="links">
							<div>
								If you don't have our app installed, check the installation steps{' '}
								<a
									target="_blank"
									rel="noreferrer"
									className="App-link"
									href="https://questbook.gitbook.io/reclaim-protocol/installing-reclaim-wallet"
								>
									here
								</a>
							</div>
						</div>
					)}

					{status === 'verified' ? (
						<h3>Thanks for submitting your link!</h3>
					) : loading ? (
						<>
							<div className="loader"></div>
							{appUrl && (
								<>
									<h3>On mobile device?</h3>
									<a href={appUrl} target="_blank" rel="noreferrer" className="App-link">
										Click here to open on Reclaim Wallet App
									</a>
									<h3>On laptop/desktop?</h3>
									<QRCodeSVG value={appUrl} />
									<p>or, Copy the link and send to your phone</p>
									<input readOnly className="text-black" value={appUrl} />
								</>
							)}
						</>
					) : null}
				</header>
			</div>

			<Toaster />
		</>
	)
}

export default App
