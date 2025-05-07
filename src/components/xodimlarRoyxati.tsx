import { PlusOutlined } from '@ant-design/icons'
import { Button, Empty, Input, Select, Space } from 'antd'
import { useEffect, useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store/store'

const XodimlarRoyxati = () => {
	interface EmployeeItem {
		user_full_name: string
		user_role: string
		branch_name: string
		end_time: string
		user: {
			phone_number: string
			birth_date: string
		}
	}
	const [employ, setEmploy] = useState([])
	const [son, setSon] = useState<number>(1)
	const getPersons = async () => {
		const token = localStorage.getItem('access_token')
		if (!token) {
			console.warn('Token topilmadi. Iltimos, login qiling.')
			return
		}

		try {
			const res = await fetch(
				`https://api.noventer.uz/api/v1/employee/employees/branch/${son}/`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			)

			if (!res.ok) {
				throw new Error(`Xato status: ${res.status}`)
			}

			const data = await res.json()
			setEmploy(data.results)
			console.log('Xodimlar:', data.results)
		} catch (err) {
			console.error('Xodimlarni olishda xatolik:', err)
		}
	}

	useEffect(() => {
		getPersons()
	}, [son])
	const dispatch = useDispatch<AppDispatch>()
	// const selector = useSelector(item => item)
	const handleChange = (value: string) => {
		console.log(`selected ${value}`)
		setSon(value)
	}
	console.log(employ)
	return (
		<div>
			<div className='w-full '>
				<div className='w-full py-[30px] flex justify-between items-center'>
					<Button
						type='primary'
						shape='round'
						icon={<PlusOutlined />}
						size={'middle'}
					>
						Xodim Qo'shish
					</Button>
					<div className='flex gap-3'>
						<Input
							placeholder='Qidirish...'
							prefix={<IoSearchOutline />}
							style={{ width: 300 }}
						/>
						<Space wrap>
							<Select
								defaultValue='Filial'
								style={{ width: 120 }}
								onChange={handleChange}
								options={[
									{ value: '1', label: 'Uchtepa' },
									{ value: '2', label: 'Chilonzor' },
									{ value: '3', label: 'Yashnobod' },
								]}
							/>
						</Space>
					</div>
				</div>
				<div className='w-full border border-black/10 grid grid-cols-6 p-3'>
					<ul className='col-span-6 grid grid-cols-6 items-center gap-[30px]'>
						<li className=' text-[15px] font-semibold text-center'>F.I.SH</li>
						<li className=' text-[15px] font-semibold text-center'>Role</li>
						<li className=' text-[15px] font-semibold text-center'>Phone</li>
						<li className=' text-[15px] font-semibold text-center'>Filial</li>
						<li className=' text-[15px] font-semibold text-center'>Smenasi</li>
						<li className=' text-[15px] font-semibold text-center'>
							Tug'ilgan sanasi
						</li>
					</ul>
					{employ.length > 0 ? (
						employ.map((item: EmployeeItem, index) => {
							return (
								<ul
									key={index}
									className='col-span-6 grid grid-cols-6 items-center mt-5 gap-[30px]'
								>
									<li className='text-center mt-2'>{item.user_full_name}</li>
									<li className='text-center mt-2'>{item.user.phone_number}</li>
									<li className='text-center mt-2'>{item.branch_name}</li>
									<li className='text-center mt-2'>{item.end_time}</li>
									<li className='text-center mt-2'>{item.user_role}</li>
									<li className='text-center mt-2'>{item.user.birth_date}</li>
								</ul>
							)
						})
					) : (
						<div className='flex justify-center items-center w-full h-[400px] col-span-6'>
							<Empty />
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default XodimlarRoyxati
