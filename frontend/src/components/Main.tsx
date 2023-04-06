import axios from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { extractGitHubRepoPath, handleError } from '../utils'
import Form, { Inputs } from './Form'
import QrMessage from './QrMessage'
import Gift from './static/Svg/Gift'
import image from './static/Svg/undraw_online_cv_re_gn0a.svg'
import screen1 from './static/Svg/screen1.jpg'
import screen2 from './static/Svg/screen2.jpg'
import screen3 from './static/Svg/screen3.jpg'


const getCallbackUrl = 'http://192.168.240.222:8000' + '/home'
const statusUrl = 'http://192.168.240.222:8000' + '/status'

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
		<div className="flex  w-full h-full p-2 lg:p-10 py-20">
			<div className="flex flex-col  items-center justify-center max-w-full m-auto text-center lg:text-start lg:items-start">
				<div className="break-all">
					<h3 className="text-yellow  leading-[62px] font-extrabold text-5xl">
						Show off your
					</h3>
					<h3 className="text-white  leading-[62px] font-extrabold text-5xl">
						projects
					</h3>
					<h3 className="text-white  leading-[62px] font-extrabold text-5xl">
						in a unique way to the recruitors!
					</h3>
				</div>
				<div className="mb-12">
					<h3 className="text-xl text-white text-opacity-70">
						your entire resume in one place!{' '}
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
				<img src={image} className="w-64" />
			</div>
		</div>
	)
}
