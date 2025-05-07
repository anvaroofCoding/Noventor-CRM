import { Layout } from 'antd'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './components/sidebar'
import Navbar from './layout/navbar'

function App() {
	const { Content } = Layout
	const access_token = localStorage.getItem('access_token')
	const refrush_token = localStorage.getItem('refrush_token')
	const navigate = useNavigate()

	const token_prosses = () => {
		if (!!access_token && !!refrush_token) {
			navigate('/')
		} else {
			navigate('/login')
		}
	}

	useEffect(() => {
		token_prosses()
	}, [])
	return (
		<div>
			<Navbar />
			<Layout>
				<Sidebar />
				<Layout>
					<Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
						<Outlet />
						{/* <Account /> */}
					</Content>
				</Layout>
			</Layout>
		</div>
	)
}

export default App
