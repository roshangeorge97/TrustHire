import axios from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { extractGitHubRepoPath, handleError } from '../utils'
import Form, { Inputs } from './Form'
import QrMessage from './QrMessage'
import Device from './static/Device'
import Gift from './static/Svg/Gift'

const getCallbackUrl = process.env.REACT_APP_BACKEND_BASE_URL + '/home'
const statusUrl = process.env.REACT_APP_BACKEND_BASE_URL + '/status'

export default function Main() {
	const [callbackId, setCallbackId] = useState<string | null>(null)
	const [status, setStatus] = useState<string | null>(null)
	const [appUrl, setAppUrl] = useState<string | null>(null)

	const getStatus = async (callbackId: string) => {
		const response = await axios.get(statusUrl + `/${callbackId}`)
		setStatus(response.data.status)
	}

	const getCallback = async (input: Inputs) => {
		const params = {
			email: input.email,
			repo: extractGitHubRepoPath(input.repoLink),
		}
		return toast.promise(
			axios.get(getCallbackUrl + '/repo', {
				params,
			}),
			{
				loading: 'Loading..',
				error: (error) => handleError(error),
				success: 'Success',
			}
		)
	}

	const proveIt = async (input: Inputs) => {
		const response = await getCallback(input)
		if (response.status !== 200) {
			throw new Error('Something went wrong')
		}
		setCallbackId(response.data.callbackId)
		setAppUrl(response.data.url)
	}

	useEffect(() => {
		if (!callbackId) return

		const interval = setInterval(() => {
			getStatus(callbackId)
		}, 2000)

		return () => clearInterval(interval)
	}, [callbackId])

	return (
		<div className="flex min-h-screen items-center w-full h-full max-w-90% lg:max-w-[70%] mx-auto justify-between gap-36 lg:gap-20 flex-col lg:flex-row flex-wrap  max-w-full p-2 lg:p-10 py-20">
			<div className="flex flex-col items-center justify-center max-w-full m-auto text-center lg:text-start lg:items-start">
				<Gift className="mb-10" />
				<div>
					<h3 className="text-yellow font-AgrandirGrandHeavy leading-[62px] font-extrabold text-5xl">
						Swags
					</h3>
					<h3 className="text-white font-AgrandirGrandHeavy leading-[62px] font-extrabold text-5xl">
						for dev
					</h3>
					<h3 className="text-white font-AgrandirGrandHeavy leading-[62px] font-extrabold text-5xl">
						contributions
					</h3>
				</div>
				<div className="mb-12">
					<h3 className="text-xl font-Fredoka text-white text-opacity-70">
						Show your Github and earn goodies, and gifts.{' '}
					</h3>
				</div>

				{status === 'verified' ? (
					<div className="mb-12">
						<h3 className="text-3xl font-bold text-yellow">
							<span className="opacity-100">🚀</span> Thanks for verification{' '}
							<span className="opacity-100">🚀</span>
						</h3>
					</div>
				) : appUrl && callbackId ? (
					<QrMessage appUrl={appUrl} />
				) : (
					<Form proveIt={proveIt} />
				)}
			</div>

			<div className="max-w-full m-auto">
				<Device />
			</div>
		</div>
	)
}
