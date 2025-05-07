import {
	BarChartOutlined,
	HomeOutlined,
	LogoutOutlined,
	TeamOutlined,
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const { Sider } = Layout

const Sidebar: React.FC = () => {
	const navigate = useNavigate()

	return (
		<Sider
			breakpoint='lg'
			collapsedWidth='0'
			style={{
				minHeight: '100vh',
				background: '#fff',
				borderRight: '1px solid rgba(0, 0, 0, 0.204)',
			}}
		>
			<Menu mode='inline' defaultSelectedKeys={['1']}>
				<Menu.Item
					key='1'
					icon={<HomeOutlined />}
					onClick={() => navigate('/royxat')}
				>
					Xodimlar ro‘yxati
				</Menu.Item>

				<Menu.Item
					key='2'
					icon={<TeamOutlined />}
					onClick={() => navigate('/xodimlar-davomati')}
				>
					Xodimlar davomati
				</Menu.Item>

				<Menu.Item
					key='3'
					icon={<BarChartOutlined />}
					onClick={() => navigate('/hisobot')}
				>
					Oylik hisobot
				</Menu.Item>

				<Menu.Item
					key='4'
					icon={<TeamOutlined />}
					onClick={() => navigate('/mijozlar')}
				>
					Mijozlar
				</Menu.Item>

				<Menu.Item
					key='5'
					icon={<LogoutOutlined />}
					onClick={() => {
						localStorage.removeItem('token')
						navigate('/login')
					}}
					style={{ position: 'absolute', bottom: 20, width: '100%' }}
				>
					Yopish
				</Menu.Item>
			</Menu>
		</Sider>
	)
}

export default Sidebar
