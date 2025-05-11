import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import {
	Button,
	DatePicker,
	Empty,
	Form,
	Input,
	message,
	Modal,
	Pagination,
	Select,
	Space,
} from 'antd'
import { useEffect, useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'

const XodimlarRoyxati = () => {
	interface EmployeeItem {
		id?: number
		user_full_name: string
		user_role: string
		branch_name: string
		end_time: string
		user: {
			phone_number: string
			birth_date: string
		}
	}

	const [form] = Form.useForm()
	const [employ, setEmploy] = useState<EmployeeItem[]>([])
	const [branchId, setBranchId] = useState(1)
	const [open, setOpen] = useState(false)
	const [shifts, setShifts] = useState([])
	const [page, setPage] = useState(1)
	const [total, setTotal] = useState(0)
	const [searchText, setSearchText] = useState('')

	const PAGE_SIZE = 10
	const getPersona = async () => {
		if (!token) return console.warn('Token topilmadi.')
		try {
			const offset = (page - 1) * PAGE_SIZE
			const searchParam = searchText ? `&search=${searchText}` : ''
			const branchParam = branchId ? `&branch=${branchId}` : ''
			const res = await fetch(
				`https://api.noventer.uz/api/v1/employee/employees/?limit=${PAGE_SIZE}&offset=${offset}${branchParam}${searchParam}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			const data = await res.json()
			setEmploy(data.results)
			setTotal(data.count)
		} catch (err) {
			console.error('Xatolik:', err)
		}
	}

	useEffect(() => {
		getPersona()
	}, [branchId, page, searchText])

	const token = localStorage.getItem('access_token')

	useEffect(() => {
		if (!branchId) return
		const token = localStorage.getItem('access_token')
		if (!token) return

		const getShifts = async () => {
			try {
				const res = await fetch(
					`https://api.noventer.uz/api/v1/company/shifts/${branchId}/`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
							'Content-Type': 'application/json',
						},
					}
				)
				const data = await res.json()
				setShifts(data || [])
			} catch (error) {
				console.error('Smena olishda xatolik:', error)
			}
		}

		getShifts()
	}, [branchId])

	useEffect(() => {
		if (!branchId) return
		// ...
	}, [branchId, page])

	const handleChange = (value: number | string) => {
		setBranchId(Number(value))
	}
	const getPersons = async () => {
		if (!token) return console.warn('Token topilmadi.')
		try {
			const res = await fetch(
				`https://api.noventer.uz/api/v1/employee/employees/branch/${branchId}/`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			const data = await res.json()
			setEmploy(data.results)
		} catch (err) {
			console.error('Xatolik:', err)
		}
	}

	useEffect(() => {
		getPersons()
	}, [branchId])

	const handleAdd = async (values: any) => {
		try {
			const payload = {
				user: {
					full_name: values.full_name,
					gender: values.gender,
					phone_number: values.phone_number,
					passport_number: values.passport_number,
					jshshr: values.jshshr,
					birth_date: values.birth_date.format('YYYY-MM-DD'),
					salary_type: values.salary_type,
				},
				branch_id: Number(values.branch_id),
				department_id: Number(values.department_id),
				shift_id: Number(values.shift_id),
				position: values.position,
				salary: values.salary,
				official_salary: values.official_salary,
			}

			const res = await fetch(
				`https://api.noventer.uz/api/v1/employee/employees/`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(payload),
				}
			)

			if (res.ok) {
				message.success("Xodim muvaffaqiyatli qo'shildi!")
				setOpen(false)
				getPersons()
				form.resetFields()
			} else {
				const err = await res.json()
				console.error('Xatolik:', err)
				message.error('Xatolik: ' + JSON.stringify(err))
			}
		} catch (err) {
			console.error(err)
			message.error('Server bilan ulanishda xatolik')
		}
	}

	const handleDelete = async (id: number) => {
		try {
			const res = await fetch(
				`https://api.noventer.uz/api/v1/employee/employees/${id}/`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			if (res.ok) {
				message.success("Xodim o'chirildi")
				getPersons()
			}
		} catch (err) {
			console.error(err)
			message.error('O‘chirishda xatolik')
		}
	}

	return (
		<div className='w-full'>
			{/* Header */}
			<div className='py-[30px] flex justify-between items-center'>
				<Button
					type='primary'
					shape='round'
					icon={<PlusOutlined />}
					size={'middle'}
					onClick={() => setOpen(true)}
				>
					Xodim Qo'shish
				</Button>
				<div className='flex gap-3'>
					<Input
						placeholder='Qidirish...'
						prefix={<IoSearchOutline />}
						style={{ width: 300 }}
						value={searchText}
						onChange={e => setSearchText(e.target.value)}
						onPressEnter={() => {
							setPage(1)
							getPersona()
						}}
					/>

					<Space wrap>
						<Select
							defaultValue='1'
							style={{ width: 120 }}
							onChange={val => setBranchId(Number(val))}
							options={[
								{ value: '1', label: 'Uchtepa' },
								{ value: '2', label: 'Chilonzor' },
								{ value: '3', label: 'Yashnobod' },
							]}
						/>
					</Space>
				</div>
			</div>

			{/* Jadval */}
			<div className='border border-black/10 grid grid-cols-6 p-3'>
				<ul className='col-span-6 grid grid-cols-7 gap-[20px] font-semibold text-center'>
					<li>F.I.SH</li>
					<li>Role</li>
					<li>Telefon</li>
					<li>Filial</li>
					<li>Smena</li>
					<li>Tug‘ilgan sana</li>
					<li>Amallar</li>
				</ul>
				{employ.length > 0 ? (
					employ.map((item, i) => (
						<ul
							key={i}
							className='col-span-6 grid grid-cols-7 items-center text-center mt-3 gap-[20px]'
						>
							<li>{item.user_full_name}</li>
							<li>{item.user_role}</li>
							<li>{item.user.phone_number}</li>
							<li>{item.branch_name}</li>
							<li>{item.end_time}</li>
							<li>{item.user.birth_date}</li>
							<li>
								<Button
									type='primary'
									danger
									icon={<DeleteOutlined />}
									onClick={() => handleDelete(item.id!)}
								/>
							</li>
						</ul>
					))
				) : (
					<div className='col-span-6 flex justify-center items-center h-[300px]'>
						<Empty />
					</div>
				)}
			</div>

			{/* Modal */}
			<Modal
				open={open}
				title="Yangi xodim qo'shish"
				onCancel={() => setOpen(false)}
				onOk={() => form.submit()}
				okText='Saqlash'
			>
				<Form layout='vertical' form={form} onFinish={handleAdd}>
					<Form.Item
						name='full_name'
						label='F.I.SH'
						rules={[{ required: true }]}
					>
						<Input />
					</Form.Item>
					<Form.Item name='gender' label='Jinsi' rules={[{ required: true }]}>
						<Select
							options={[
								{ label: 'Erkak', value: 'male' },
								{ label: 'Ayol', value: 'female' },
							]}
						/>
					</Form.Item>
					<Form.Item
						name='phone_number'
						label='Telefon raqam'
						rules={[{ required: true }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name='passport_number'
						label='Passport raqam'
						rules={[{ required: true, message: 'Passport raqam kiriting' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name='jshshr'
						label='JSHSHIR'
						rules={[{ required: true, message: 'JSHSHIR kiriting' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name='birth_date'
						label='Tug‘ilgan sana'
						rules={[{ required: true }]}
					>
						<DatePicker className='w-full' />
					</Form.Item>
					<Form.Item name='salary_type' label='Maosh turi'>
						<Select
							options={[
								{ label: 'Rasmiy', value: 'official' },
								{ label: 'Norasmiy', value: 'unofficial' },
							]}
						/>
					</Form.Item>
					<Form.Item
						name='branch_id'
						label='Filial tanlang'
						rules={[{ required: true, message: 'Filialni tanlang' }]}
					>
						<Select placeholder='Filial tanlang' onChange={handleChange}>
							<Select.Option value={1}>Uchtepa</Select.Option>
							<Select.Option value={2}>Chilonzor</Select.Option>
							<Select.Option value={3}>Yashnobod</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item
						name='department_id'
						label='Bo‘lim ID'
						rules={[{ required: true }]}
					>
						<Input type='number' />
					</Form.Item>
					<Form.Item name='shift_id' label='Smena'>
						<Select placeholder='Smena tanlang'>
							{shifts.map((shift: any) => (
								<Select.Option key={shift.id} value={shift.id}>
									{shift.name} ({shift.start_time} - {shift.end_time})
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						name='position'
						label='Lavozim'
						rules={[{ required: true }]}
					>
						<Select
							options={[
								{ label: 'Employee', value: 'employee' },
								{ label: 'Manager', value: 'manager' },
								{ label: 'Director', value: 'director' },
							]}
						/>
					</Form.Item>
					<Form.Item name='salary' label='Maosh'>
						<Input />
					</Form.Item>
					<Form.Item name='official_salary' label='Rasmiy maosh'>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
			<div className='flex justify-center my-6'>
				<Pagination
					current={page}
					pageSize={PAGE_SIZE}
					total={total}
					onChange={p => setPage(p)}
					showSizeChanger={false}
				/>
			</div>
		</div>
	)
}

export default XodimlarRoyxati
