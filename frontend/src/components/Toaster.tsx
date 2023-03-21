import { Toaster as ReactToaster } from 'react-hot-toast'

export default function Toaster() {
	return (
		<ReactToaster
			position="bottom-center"
			toastOptions={{
				success: {
					duration: 1000,
				},
				error: {
					duration: 3000,
				},
			}}
		/>
	)
}
