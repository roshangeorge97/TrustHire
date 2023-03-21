import jsQR from 'jsqr'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useMemo, useRef, useState } from 'react'
import '../App.css'
import Spinner from '../components/Spinner'
import useScanner from '../hooks/useScanner'

type ScanPageProps = {
	proveIt: (str: string) => Promise<void>
	status: string | null
	callbackUrl: string | null
	appUrl: string | null
	loading: boolean
}

export default function ScanPage({
	proveIt,
	callbackUrl,
	status,
	appUrl,
	loading,
}: ScanPageProps) {
	const videoElmRef = useRef<HTMLVideoElement>(null)
	const canvasElmRef = useRef<HTMLCanvasElement>(null)
	const imageElmRef = useRef<HTMLCanvasElement>(null)
	const drawElmRef = useRef<HTMLCanvasElement>(null)
	const uploadBtnRef = useRef<HTMLInputElement | null>(null)
	const [repo, setRepo] = useState<string | null>(null)

	const handleSetRepo = async (str: string) => {
		if (str.indexOf('/') > -1 && str.split('/').length === 2) {
			return setRepo(str)
		}
		throw new Error('Invalid Repository name')
	}

	const { streamingErr, streamStatus } = useScanner(
		videoElmRef,
		canvasElmRef,
		handleSetRepo,
		drawElmRef
	)

	useEffect(() => {
		if (!repo) return
		proveIt(repo).catch(() => setRepo(null))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [repo])

	const handleUpload = () => {
		if (!uploadBtnRef.current) return
		uploadBtnRef.current.click()
	}

	const clearImage = (
		ctx: CanvasRenderingContext2D | null,
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		ctx && ctx.clearRect(0, 0, 0, 0)
		setRepo(null)
		event.target.value = ''
	}

	const handleFileInputChange = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const canvasElm = imageElmRef.current
		const ctx = canvasElm!.getContext('2d')

		if (canvasElm && ctx) {
			if (e.target.files) {
				const file = e.target.files[0]

				if (!file) return

				const reader = new FileReader()
				reader.readAsDataURL(file)

				reader.onload = () => {
					const img = new Image()
					img.onload = () => {
						canvasElm.width = img.width
						canvasElm.height = img.height
						ctx.drawImage(img, 0, 0, img.width, img.height)

						const data = ctx.getImageData(0, 0, img.width, img.height).data
						const code = jsQR(data, canvasElm.width, canvasElm.height)
						if (code?.data) {
							handleSetRepo(code.data).catch((err) => {
								alert(err?.message || 'Something went wrong')
								clearImage(ctx, e)
							})
						} else {
							alert('No data found')
							clearImage(ctx, e)
						}
					}

					img.src = reader.result as string
				}
			}
		}
	}

	const renderStream = useMemo(() => {
		switch (streamStatus) {
			case 'loading':
				return (
					<div className="p-2 py-4 flex flex-col gap-2 items-center">
						<Spinner />
						<h1>Loading...</h1>
					</div>
				)
			// case 'streaming':
			// 	return (
			// 		<div className="absolute aspect-square h-[40%] border-yellow-300 border-2 top-[40%] -translate-y-[50%]"></div>
			// 	)
			case 'error':
				return (
					streamingErr && (
						<div className="p-2 text-center py-4 text-red-500">
							{streamingErr.message}
						</div>
					)
				)
		}
	}, [streamStatus, streamingErr])

	return (
		<div className="flex justify-start gap-2 w-full h-full flex-col items-center app text-center">
			<header
				className={`App-header p-2  ${callbackUrl ? 'bg-[#282c34]' : 'bg-[#fff]'}`}
			>
				<h1 className="mb-2">Prove that you've contributed to a github repo</h1>

				{callbackUrl ? (
					<div className="links text-center">
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
				) : (
					<>
						<canvas
							id="canvas"
							// className="w-full md:w-4/5 h-4/5 md:h-4/5"
							ref={canvasElmRef}
							hidden
						></canvas>
						<canvas
							id="draw"
							className="w-full md:w-4/5 h-4/5 md:h-4/5 -z-10 object-cover absolute"
							ref={drawElmRef}
						></canvas>

						<canvas
							hidden
							id="imagecanvas"
							className="w-full md:w-4/5 h-4/5 md:h-4/5 object-cover absolute"
							ref={imageElmRef}
						></canvas>

						<video
							hidden
							className="w-full md:w-4/5 h-4/5 md:h-4/5 object-cover"
							id="video"
							ref={videoElmRef}
						></video>

						{renderStream}

						<div className="m-2">
							<input
								accept="image/*"
								type="file"
								name="upload file"
								hidden
								ref={uploadBtnRef}
								onChange={handleFileInputChange}
							/>
							<button
								onClick={handleUpload}
								type="button"
								className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 max-w-fit disabled:bg-gray-300 disabled:hover:bg-gray-300"
							>
								Upload
							</button>
						</div>
					</>
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
								<input className="text-black" readOnly value={appUrl} />
							</>
						)}
					</>
				) : null}
			</header>
		</div>
	)
}
