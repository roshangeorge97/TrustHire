import { QRCodeSVG } from 'qrcode.react'
import Arrow from './static/Svg/Arrow'

const QrMessage = ({ appUrl }: { appUrl: string }) => {
	return (
		<div>
			<div className="mb-4 block lg:hidden">
				<a
					className="text-blue-800 text-lg underline"
					target="_blank"
					rel="noreferrer"
					href={appUrl}
				>
					Click here to open on Reclaim Wallet app
				</a>

				<h3 className="text-yellow mt-2">OR</h3>
			</div>
			<div>
				<div className="flex items-center lg:justify-start justify-center mb-10 gap  lg:gap-10">
					<div className="p-2 bg-white rounded-2xl">
						<QRCodeSVG className="w-54 h-54" value={appUrl} size={250} />
					</div>

					<Arrow className="hidden lg:block" />
				</div>
				<h3 className="px-20 lg:px-0 lg:pr-20 text-2xl text-white font-Agrandir">
					<span className="text-yellow">Scan Qr</span> to download the app
				</h3>
			</div>
		</div>
	)
}

export default QrMessage
