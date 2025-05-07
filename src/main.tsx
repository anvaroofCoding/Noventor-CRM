import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import Account from './components/account'
import Clients from './components/clients'
import Davomat from './components/davomat'
import Hisobot from './components/hisobot'
import XodimlarRoyxati from './components/xodimlarRoyxati'
import Login from './features/auth/login'
import './index.css'
import { store } from './store/store'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<Routes>
					<Route path='login' element={<Login />} />
					<Route path='/' element={<App />}>
						<Route path='/xodimlar-davomati' element={<Davomat />} />
						<Route path='/mijozlar' element={<Clients />} />
						<Route path='/hisobot' element={<Hisobot />} />
						<Route path='/royxat' element={<XodimlarRoyxati />} />
						<Route path='/account-me' element={<Account />} />
						<Route path='/' element={<Account />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</Provider>
	</StrictMode>
)
