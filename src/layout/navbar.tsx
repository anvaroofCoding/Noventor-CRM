import { Input } from 'antd'
import { useEffect, useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import logo from '../assets/images/logo.svg'

interface UserData {
	id: number
	full_name: string
	birth_date: string // "YYYY-MM-DD" formatda
	gender: 'male' | 'female' | string
	email: string
	avatar: string
	face_id: string | null
	company_id: number
	role: string
	salary_type: string
}
const Navbar = () => {
	const [user, setUser] = useState<UserData | null>(null)

	const fetchUser = async () => {
		const token = localStorage.getItem('access_token')
		if (!token) {
			console.warn('Token topilmadi. Iltimos, login qiling.')
			return
		}
		try {
			const response = await fetch(
				'https://api.noventer.uz/api/v1/accounts/me/',
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			// console.log(response)

			if (!response.ok) {
				throw new Error(`Xato status: ${response.status}`)
			}

			const data = await response.json()
			// dispatch(data)
			setUser(data)
		} catch (error) {
			console.error('Foydalanuvchini olishda xatolik:', error)
		}
	}

	useEffect(() => {
		fetchUser()
	}, [])

	return (
		<div>
			<nav>
				<div className='mx-auto px-6 h-[80px] border-b border-black/20 flex justify-between items-center'>
					<Link
						to={'/'}
						className='flex justify-center items-center gap-[10px]'
					>
						<img src={logo} alt='logo' />
						<h1 className='text-[30px]'>Noventor</h1>
					</Link>

					<Input
						placeholder='Qidirish...'
						prefix={<IoSearchOutline />}
						style={{ width: 300 }}
					/>
					<div className='w-[40px] h-[40px] rounded-[50%] border'>
						<Link to={'/account-me'}>
							<img
								src={user?.avatar}
								alt=''
								className='w-full h-full rounded-[50%]'
							/>
						</Link>
					</div>
				</div>
			</nav>
		</div>
	)
}

export default Navbar
