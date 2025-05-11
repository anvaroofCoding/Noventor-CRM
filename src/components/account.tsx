import { Card, Col, Row, Statistic, type StatisticProps } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import { FcDocument } from 'react-icons/fc'
import { Link } from 'react-router-dom'

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

export interface BranchItem {
	id: number
	name: string
	region: string
	district: string
	phone: string
	additional_phone: string | null
	address: string
	latitude: string | null
	longitude: string | null
	working_days: any[] // agar `working_days` strukturasi aniq bo‘lsa, o‘zgaritish mumkin
}
export interface CompanyItem {
	id: number
	name: string
	owner: number
	logo: string | null
	stir: string
	license_file: string
	created_at: string
	updated_at: string
	branches: BranchItem[]
}
const Account = () => {
	const [user, setUser] = useState<UserData | null>(null)
	const [up, Setup] = useState<CompanyItem | null>(null)

	const fetchUser = async () => {
		const token = localStorage.getItem('access_token')
		// console.log(token)
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
			setUser(data)
		} catch (error) {
			console.error('Foydalanuvchini olishda xatolik:', error)
		}
	}
	const fetchUsers = async () => {
		const token = localStorage.getItem('access_token')
		// console.log(token)
		if (!token) {
			console.warn('Token topilmadi. Iltimos, login qiling.')
			return
		}

		try {
			const response = await fetch(
				'https://api.noventer.uz/api/v1/company/get/',
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
			Setup(data)
		} catch (error) {
			console.error('Foydalanuvchini olishda xatolik:', error)
		}
	}

	useEffect(() => {
		fetchUser()
		fetchUsers()
	}, [])

	const formatter: StatisticProps['formatter'] = value => (
		<CountUp end={value as number} separator=',' />
	)
	return (
		<div>
			<div className='w-[801px] h-auto'>
				<div className='bg-[url(/src/assets/images/accaount.png)] w-full h-[204px] rounded-2xl flex justify-between items-center p-4'>
					<div className='flex items-center justify-start gap-[30px] w-[372px] h-[86px]'>
						<div className='w-[86px] h-[86px] rounded-2xl bg-white flex justify-center items-center'>
							{/* <h1 className='text-[42px] font-bold'>A</h1> */}
							<img src={user?.avatar} alt='' />
						</div>
						<div className='text-white'>
							<h3>Xush Kelibsiz!</h3>
							<h2 className='text-[30px] font-bold '>{user?.full_name}</h2>
							<span className='p-1 bg-white rounded-2xl text-gray-600'>
								Rahbar
							</span>
						</div>
					</div>
					<div className='w-[267px] h-[128px] bg-white/10 border border-white/20 rounded-2xl text-white p-2 flex justify-between flex-col'>
						<div>
							<p>Finance card</p>
							<p>ID: 0989736</p>
						</div>
						<div>
							<p>Current balance:</p>
							<h2 className='text-[25px]'>557 000 so’m</h2>
						</div>
					</div>
				</div>
			</div>
			<div className='h-[200px] w-[801px] my-10 flex justify-between items-center '>
				<Row gutter={[24, 24]} justify='space-between'>
					{[
						{ title: 'Vazifalar soni:', value: 150 },
						{ title: 'Rasmiy Oylik', value: 12000000, precision: 2 },
						{ title: 'Norasmiy Oylik', value: 20000000, precision: 2 },
					].map((item, index) => (
						<Col xs={24} sm={12} md={8} key={index}>
							<Card
								style={{
									boxShadow: '0 4px 12px #583C87',
									borderRadius: '12px',
									padding: '20px',
									background: '#fff',
								}}
								bordered={false}
							>
								<Statistic
									title={item.title}
									value={item.value}
									precision={item.precision}
									formatter={formatter}
								/>
							</Card>
						</Col>
					))}
				</Row>
			</div>
			<div className='mt-[50px]'>
				<h2 className='font-bold text-[20px] flex items-center gap-[5px]'>
					<FcDocument /> Malumotlar:
				</h2>
				<div className='flex gap-[30px] mt-[30px]'>
					<ul className='flex flex-col items-start gap-[10px] text-[18px]'>
						<li>Telefon raqam: +998 99 966 7363</li>
						<li>email: {user?.email}</li>
						<li>Birthday: {user?.birth_date}</li>
						<li>Gender: {user?.gender}</li>
					</ul>
					<ul className='flex flex-col items-start gap-[10px] text-[18px]'>
						<li>Kompaniya nomi: {up?.name} </li>
						<li>INN: {up?.stir}</li>
						<li>
							Ro’yxatdan o’tgan sana:{' '}
							{dayjs(up?.updated_at).format('DD.MM.YYYY HH:mm')}
						</li>
						<li>
							Lizensiya:{' '}
							<Link to={'{up?.license_file}'}>Litsenziyani yuklab olish</Link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	)
}

export default Account
