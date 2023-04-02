import './App.css'
import Main from './components/Main'
import Toaster from './components/Toaster'

function App() {
	return (
		<>
			<Main />

			<div className="fixed bottom-5 left-1/2 -translate-x-1/2 -z-10">
				<h3 className="text-xl text-white text-opacity-70 w-full whitespace-nowrap">
					Made with ❤️ by Questbook
				</h3>
			</div>

			<Toaster />
		</>
	)
}

export default App
