import { Toaster as ReactToaster } from 'react-hot-toast'

export default function Toaster() {
	return (
		<ReactToaster
			position="top-center"
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
