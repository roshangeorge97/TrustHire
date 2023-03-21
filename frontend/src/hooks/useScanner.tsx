import jsQR from 'jsqr'
import { Point } from 'jsqr/dist/locator'
import { useEffect, useState } from 'react'

export type StreamStatus = 'loading' | 'error' | 'streaming'
export type StreamingError = Error | null

export default function useScanner(
	videoElmRef: React.RefObject<HTMLVideoElement>,
	canvasElmRef: React.RefObject<HTMLCanvasElement>,
	handleSetRepo: (str: string) => Promise<void>,
	drawElmRef: React.RefObject<HTMLCanvasElement>
) {
	const [streamStatus, setStreamStatus] = useState<StreamStatus>('loading')
	const [streamingErr, setStreamingErr] = useState<Error | null>(null)

	function drawLine(
		begin: Point,
		end: Point,
		color: string,
		canvasElement: CanvasRenderingContext2D
	) {
		canvasElement.beginPath()
		canvasElement.moveTo(begin.x, begin.y)
		canvasElement.lineTo(end.x, end.y)
		canvasElement.lineWidth = 0.3
		canvasElement.strokeStyle = color
		canvasElement.stroke()
	}

	async function scan() {
		// const drawElement = drawElmRef.current!.getContext('2d')
 
		if (videoElmRef.current && canvasElmRef.current) {
			const canvasElement = canvasElmRef.current.getContext('2d')

			 
			if (
				videoElmRef.current.readyState === videoElmRef.current.HAVE_ENOUGH_DATA
			) {
			 
				canvasElement!.drawImage(
					videoElmRef.current,
					0,
					0,
					drawElmRef.current!.width,
					drawElmRef.current!.height
				)
				const imageData = canvasElement!.getImageData(
					0,
					0,
					canvasElmRef.current.width,
					canvasElmRef.current.height
				)
				const code = jsQR(imageData.data, imageData.width, imageData.height, {
					inversionAttempts: 'dontInvert',
				})
				if (code) {
					// console.log('code here')
					// console.log("code here", code.data);
					// drawLine(
					// 	code.location.topLeftCorner,
					// 	code.location.topRightCorner,
					// 	'#fde047',
					// 	drawElement!
					// )
					// drawLine(
					// 	code.location.topRightCorner,
					// 	code.location.bottomRightCorner,
					// 	'#fde047',
					// 	drawElement!
					// )
					// drawLine(
					// 	code.location.bottomRightCorner,
					// 	code.location.bottomLeftCorner,
					// 	'#fde047',
					// 	drawElement!
					// )
					// drawLine(
					// 	code.location.bottomLeftCorner,
					// 	code.location.topLeftCorner,
					// 	'#fde047',
					// 	drawElement!
					// )
					if (code.data) {						 
						/**
						 * got the string encoded in qrcode
						 */
						handleSetRepo(code.data).catch((e) => alert(e?.message || "Something went wrong"))
					}
					 
				} 
				// else {
				// 	drawElement?.clearRect(
				// 		0,
				// 		0,
				// 		drawElmRef.current!.width,
				// 		drawElmRef.current!.height
				// 	)
				// }
			}
			requestAnimationFrame(scan)
		}
	}

	useEffect(() => {
		async function getMedia(constraints: MediaStreamConstraints) {
			try {
				const stream = await navigator.mediaDevices.getUserMedia(constraints)

				if (stream && videoElmRef.current) {
					setStreamingErr(null)
					videoElmRef.current.srcObject = stream
					await videoElmRef.current
						.play()
						.catch((e) => console.log('error playing', e))
				}
			} catch (err) {
				setStreamingErr(err as Error)
				setStreamStatus('error')
			}
		}

		getMedia({
			video: {
				width: {
					ideal: 4096,
				},
				height: {
					ideal: 4096,
				},
			},
			audio: false,
		})
	}, [videoElmRef])

	useEffect(() => {

		if(videoElmRef.current){
			const elm = videoElmRef.current
			elm.addEventListener('playing', () => {
				elm.setAttribute('playsinline', 'true')
				elm.style.display = 'block'
				setStreamStatus('streaming')
				scan()
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return {
		streamingErr,
		streamStatus,
	}
}
