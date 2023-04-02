import { QRCodeSVG } from 'qrcode.react'
import Arrow from './static/Svg/Arrow'

const QrMessage = ({ appUrl }: { appUrl: string }) => {
	return (
		<div>
			<div className="flex items-center lg:justify-start justify-center mb-10 gap  lg:gap-10">
				<div className="p-2 bg-white rounded-2xl">
					<QRCodeSVG className="w-54 h-54 rounded-2xl" value={appUrl} size={250} />
				</div>

				<Arrow className="hidden lg:block" />
			</div>
			<h3 className="px-20 lg:px-0 lg:pr-20  text-2xl text-white font-Agrandir">
				<span className="text-yellow">Scan Qr</span> to download the app
			</h3>
		</div>
	)
}

export default QrMessage
