import {
	BarChartOutlined,
	HomeOutlined,
	LogoutOutlined,
	TeamOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Layout, Menu } from 'antd'
import { useNavigate } from 'react-router-dom'

const { Sider } = Layout

const Sidebar = () => {
	const navigate = useNavigate()

	const menuItems: MenuProps['items'] = [
		{
			key: '1',
			icon: <HomeOutlined />,
			label: 'Xodimlar ro‘yxati',
			onClick: () => navigate('/royxat'),
		},
		{
			key: '2',
			icon: <TeamOutlined />,
			label: 'Xodimlar davomati',
			onClick: () => navigate('/xodimlar-davomati'),
		},
		{
			key: '3',
			icon: <BarChartOutlined />,
			label: 'Oylik hisobot',
			onClick: () => navigate('/hisobot'),
		},
		{
			key: '4',
			icon: <TeamOutlined />,
			label: 'Mijozlar',
			onClick: () => navigate('/mijozlar'),
		},
		{
			key: '6',
			icon: <TeamOutlined />,
			label: 'Smenalar',
			onClick: () => navigate('/smenalar'),
		},
		{
			key: '5',
			icon: <LogoutOutlined />,
			label: 'Yopish',
			onClick: () => {
				localStorage.removeItem('token')
				navigate('/login')
			},
			style: { position: 'absolute', bottom: 20, width: '100%' },
		},
	]

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
			<Menu mode='inline' defaultSelectedKeys={['1']} items={menuItems} />
		</Sider>
	)
}

export default Sidebar
