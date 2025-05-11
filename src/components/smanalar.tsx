// import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
// import {
// 	Button,
// 	Empty,
// 	Form,
// 	Input,
// 	message,
// 	Modal,
// 	Select,
// 	TimePicker,
// } from 'antd'
// import dayjs from 'dayjs'
// import { useEffect, useState } from 'react'
// import { IoSearchOutline } from 'react-icons/io5'

// const Smanalar = () => {
// 	interface ShiftItem {
// 		id?: number
// 		name: string
// 		branch: number
// 		branch_name?: string
// 		start_time: string
// 		end_time: string
// 		created_at?: string
// 		updated_at?: string
// 	}

// 	const token = localStorage.getItem('access_token')
// 	const [form] = Form.useForm()
// 	const [branchId, setBranchId] = useState(1)
// 	const [open, setOpen] = useState(false)
// 	const [editId, setEditId] = useState<number | null>(null)
// 	// const [shifts, setShifts] = useState<ShiftItem[]>([])
// 	const [loading, setLoading] = useState(false)

// 	const [shifts, setShifts] = useState<ShiftItem[]>([])
// 	const [noShifts, setNoShifts] = useState(false)

// 	const fetchShifts = async () => {
// 		if (!token) return
// 		try {
// 			const res = await fetch(
// 				`https://api.noventer.uz/api/v1/company/shift-detail/${branchId}/`,
// 				{
// 					headers: {
// 						Authorization: `Bearer ${token}`,
// 						'Content-Type': 'application/json',
// 					},
// 				}
// 			)
// 			const data = await res.json()
// 			console.log(data)
// 			if (data.detail === 'Not found.') {
// 				setNoShifts(false)
// 				const builtData = Array.isArray(data) ? data : [data]
// 				setShifts(builtData)
// 			} else {
// 				setNoShifts(true)
// 				setShifts([])
// 			}
// 		} catch (err) {
// 			message.error('Smenalarni olishda xatolik')
// 		}
// 	}

// 	useEffect(() => {
// 		fetchShifts()
// 	}, [branchId])

// 	const handleChange = (value: string) => {
// 		setBranchId(+value)
// 		console.log(+value)
// 	}

// 	const handleOk = () => {
// 		form.submit()
// 	}

// 	const handleCancel = () => {
// 		setOpen(false)
// 		form.resetFields()
// 		setEditId(null)
// 	}

// 	const onFinish = async (values: any) => {
// 		if (!token) return

// 		const formData = new FormData()
// 		formData.append('name', values.name)
// 		formData.append('branch', String(values.branch))
// 		formData.append('start_time', dayjs(values.start_time).format('HH:mm'))
// 		formData.append('end_time', dayjs(values.end_time).format('HH:mm'))

// 		try {
// 			let res
// 			if (editId) {
// 				// PUT uchun JSON format qoladi
// 				const jsonPayload = {
// 					name: values.name,
// 					branch: Number(values.branch),
// 					start_time: dayjs(values.start_time).format('HH:mm:ss'),
// 					end_time: dayjs(values.end_time).format('HH:mm:ss'),
// 				}
// 				res = await fetch(
// 					`https://api.noventer.uz/api/v1/company/shift-detail/${editId}/`,
// 					{
// 						method: 'PUT',
// 						headers: {
// 							Authorization: `Bearer ${token}`,
// 							'Content-Type': 'application/json',
// 						},
// 						body: JSON.stringify(jsonPayload),
// 					}
// 				)
// 			} else {
// 				// POST uchun formData ishlatiladi
// 				res = await fetch(
// 					'https://api.noventer.uz/api/v1/company/shift-create/',
// 					{
// 						method: 'POST',
// 						headers: {
// 							Authorization: `Bearer ${token}`,
// 							// ⚠️ Content-Type qo‘ymang, avtomatik bo‘ladi
// 						},
// 						body: formData,
// 					}
// 				)
// 			}

// 			if (!res.ok) throw new Error('Serverdan muvaffaqiyatli javob kelmadi')
// 			await fetchShifts()
// 			message.success(`Smena ${editId ? 'tahrirlandi' : 'qo‘shildi'}`)
// 			handleCancel()
// 		} catch (err) {
// 			console.error(err)
// 			message.error('Saqlashda xatolik yuz berdi')
// 		}
// 	}

// 	const handleEdit = (item: ShiftItem) => {
// 		setEditId(item.id!)
// 		setOpen(true)
// 		form.setFieldsValue({
// 			branch: item.branch,
// 			name: item.name,
// 			start_time: dayjs(item.start_time, 'HH:mm:ss'),
// 			end_time: dayjs(item.end_time, 'HH:mm:ss'),
// 		})
// 	}

// 	const handleDelete = async (id: number) => {
// 		if (!token) return
// 		try {
// 			const res = await fetch(
// 				`https://api.noventer.uz/api/v1/company/shift-detail/${id}/`,
// 				{
// 					method: 'DELETE',
// 					headers: {
// 						Authorization: `Bearer ${token}`,
// 					},
// 				}
// 			)
// 			if (!res.ok) throw new Error()
// 			message.success('Smena o‘chirildi')
// 			fetchShifts()
// 		} catch {
// 			message.error('Ochirishda xatolik')
// 		}
// 	}

// 	return (
// 		<div className='w-full'>
// 			{/* Header */}
// 			<div className='py-[30px] flex justify-between items-center'>
// 				<Button
// 					type='primary'
// 					shape='round'
// 					icon={<PlusOutlined />}
// 					onClick={() => {
// 						form.resetFields()
// 						setEditId(null)
// 						setOpen(true)
// 					}}
// 				>
// 					Smena qo‘shish
// 				</Button>

// 				<Modal
// 					title={editId ? 'Smena tahrirlash' : 'Smena qo‘shish'}
// 					open={open}
// 					onOk={handleOk}
// 					onCancel={handleCancel}
// 					okText={editId ? 'Saqlash' : 'Qo‘shish'}
// 				>
// 					<Form form={form} onFinish={onFinish} layout='vertical'>
// 						<Form.Item
// 							name='branch'
// 							label='Filial ID'
// 							rules={[{ required: true, message: 'Filial ID majburiy' }]}
// 						>
// 							<Input type='number' />
// 						</Form.Item>
// 						<Form.Item
// 							name='name'
// 							label='Smena nomi'
// 							rules={[{ required: true, message: 'Smena nomi kerak' }]}
// 						>
// 							<Input />
// 						</Form.Item>
// 						<Form.Item
// 							name='start_time'
// 							label='Boshlanish vaqti'
// 							rules={[{ required: true, message: 'Boshlanish vaqti kerak' }]}
// 						>
// 							<TimePicker format='HH:mm' className='w-full' />
// 						</Form.Item>
// 						<Form.Item
// 							name='end_time'
// 							label='Tugatish vaqti'
// 							rules={[{ required: true, message: 'Tugatish vaqti kerak' }]}
// 						>
// 							<TimePicker format='HH:mm' className='w-full' />
// 						</Form.Item>
// 					</Form>
// 				</Modal>

// 				{/* Filter */}
// 				<div className='flex gap-3'>
// 					<Input
// 						placeholder='Qidirish...'
// 						prefix={<IoSearchOutline />}
// 						style={{ width: 300 }}
// 					/>
// 					<Select
// 						defaultValue='1'
// 						style={{ width: 120 }}
// 						onChange={handleChange}
// 						options={[
// 							{ value: '1', label: 'Uchtepa' },
// 							{ value: '2', label: 'Chilonzor' },
// 							{ value: '3', label: 'Yashnobod' },
// 						]}
// 					/>
// 				</div>
// 			</div>

// 			{/* Jadval */}
// 			<div className='border border-black/10 grid grid-cols-4 p-3'>
// 				<ul className='col-span-4 grid grid-cols-6 items-center gap-[20px]'>
// 					<li className='text-[15px] font-semibold text-center'>ID</li>
// 					<li className='text-[15px] font-semibold text-center'>Smena</li>
// 					<li className='text-[15px] font-semibold text-center'>Boshlanish</li>
// 					<li className='text-[15px] font-semibold text-center'>Tugatish</li>
// 					<li className='text-[15px] font-semibold text-center'>Tahrirlash</li>
// 					<li className='text-[15px] font-semibold text-center'>O‘chirish</li>
// 				</ul>

// 				{loading ? (
// 					<div className='col-span-4 text-center py-10'>Yuklanmoqda...</div>
// 				) : shifts.length > 0 ? (
// 					shifts.map(item => (
// 						<ul
// 							key={item.id}
// 							className='col-span-4 grid grid-cols-6 items-center mt-5 gap-[20px]'
// 						>
// 							<li className='text-center'>{item.id}</li>
// 							<li className='text-center'>{item.name}</li>
// 							<li className='text-center'>{item.start_time}</li>
// 							<li className='text-center'>{item.end_time}</li>
// 							<li className='text-center'>
// 								<Button
// 									icon={<EditOutlined />}
// 									onClick={() => handleEdit(item)}
// 								/>
// 							</li>
// 							<li className='text-center'>
// 								<Button
// 									danger
// 									icon={<DeleteOutlined />}
// 									onClick={() => handleDelete(item.id!)}
// 								/>
// 							</li>
// 						</ul>
// 					))
// 				) : (
// 					<div className='col-span-4 h-[300px] flex justify-center items-center'>
// 						<Empty />
// 					</div>
// 				)}
// 			</div>
// 		</div>
// 	)
// }

// export default Smanalar

import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import {
	Button,
	Empty,
	Form,
	Input,
	message,
	Modal,
	Select,
	TimePicker,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const Smanalar = () => {
	interface ShiftItem {
		id?: number
		name: string
		branch: number
		branch_name?: string
		start_time: string
		end_time: string
		created_at?: string
		updated_at?: string
	}

	const token = localStorage.getItem('access_token')
	const [form] = Form.useForm()
	const [branchId, setBranchId] = useState(1)
	const [open, setOpen] = useState(false)
	const [editId, setEditId] = useState<number | null>(null)
	const [shifts, setShifts] = useState<ShiftItem[]>([])
	const [loading, setLoading] = useState(false)

	const fetchShifts = async () => {
		if (!token) return
		try {
			setLoading(true)
			const res = await fetch(
				`https://api.noventer.uz/api/v1/company/shifts/${branchId}/`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			const data = await res.json()
			if (Array.isArray(data)) {
				setShifts(data)
			} else {
				setShifts([])
			}
		} catch (err) {
			message.error('Smenalarni olishda xatolik')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchShifts()
	}, [branchId])

	const handleChange = (value: string) => {
		setBranchId(+value)
	}

	const handleOk = () => {
		form.submit()
	}

	const handleCancel = () => {
		setOpen(false)
		form.resetFields()
		setEditId(null)
	}

	const onFinish = async (values: any) => {
		if (!token) return

		const payload = {
			name: values.name,
			branch: Number(values.branch),
			start_time: dayjs(values.start_time).format('HH:mm:ss'),
			end_time: dayjs(values.end_time).format('HH:mm:ss'),
		}

		try {
			let res
			if (editId) {
				// PUT
				res = await fetch(
					`https://api.noventer.uz/api/v1/company/shift-detail/${editId}/`,
					{
						method: 'PUT',
						headers: {
							Authorization: `Bearer ${token}`,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(payload),
					}
				)
			} else {
				// POST
				res = await fetch(
					'https://api.noventer.uz/api/v1/company/shift-create/',
					{
						method: 'POST',
						headers: {
							Authorization: `Bearer ${token}`,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(payload),
					}
				)
			}

			if (!res.ok) throw new Error('Xatolik yuz berdi')
			message.success(`Smena ${editId ? 'tahrirlandi' : 'qo‘shildi'}!`)
			handleCancel()
			fetchShifts()
		} catch (err) {
			console.error(err)
			message.error('Saqlashda xatolik yuz berdi')
		}
	}

	const handleEdit = (item: ShiftItem) => {
		setEditId(item.id!)
		setOpen(true)
		form.setFieldsValue({
			branch: item.branch,
			name: item.name,
			start_time: dayjs(item.start_time, 'HH:mm:ss'),
			end_time: dayjs(item.end_time, 'HH:mm:ss'),
		})
	}

	const handleDelete = async (id: number) => {
		if (!token) return
		try {
			const res = await fetch(
				`https://api.noventer.uz/api/v1/company/shift-detail/${id}/`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			if (!res.ok) throw new Error()
			message.success('Smena o‘chirildi')
			fetchShifts()
		} catch {
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
					onClick={() => {
						form.resetFields()
						setEditId(null)
						setOpen(true)
					}}
				>
					Smena qo‘shish
				</Button>

				{/* Modal */}
				<Modal
					title={editId ? 'Smena tahrirlash' : 'Smena qo‘shish'}
					open={open}
					onOk={handleOk}
					onCancel={handleCancel}
					okText={editId ? 'Saqlash' : 'Qo‘shish'}
				>
					<Form form={form} onFinish={onFinish} layout='vertical'>
						<Form.Item
							name='branch'
							label='Filial ID'
							rules={[{ required: true, message: 'Filial ID majburiy' }]}
						>
							<Input type='number' />
						</Form.Item>
						<Form.Item
							name='name'
							label='Smena nomi'
							rules={[{ required: true, message: 'Smena nomi kerak' }]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							name='start_time'
							label='Boshlanish vaqti'
							rules={[{ required: true, message: 'Boshlanish vaqti kerak' }]}
						>
							<TimePicker format='HH:mm' className='w-full' />
						</Form.Item>
						<Form.Item
							name='end_time'
							label='Tugatish vaqti'
							rules={[{ required: true, message: 'Tugatish vaqti kerak' }]}
						>
							<TimePicker format='HH:mm' className='w-full' />
						</Form.Item>
					</Form>
				</Modal>

				{/* Filter */}
				<div className='flex gap-3'>
					<Select
						defaultValue='1'
						style={{ width: 120 }}
						onChange={handleChange}
						options={[
							{ value: '1', label: 'Uchtepa' },
							{ value: '2', label: 'Chilonzor' },
							{ value: '3', label: 'Yashnobod' },
						]}
					/>
				</div>
			</div>

			{/* Jadval */}
			<div className='border border-black/10 grid grid-cols-4 p-3'>
				<ul className='col-span-4 grid grid-cols-6 items-center gap-[20px]'>
					<li className='text-[15px] font-semibold text-center'>ID</li>
					<li className='text-[15px] font-semibold text-center'>Smena</li>
					<li className='text-[15px] font-semibold text-center'>Boshlanish</li>
					<li className='text-[15px] font-semibold text-center'>Tugatish</li>
					<li className='text-[15px] font-semibold text-center'>Tahrirlash</li>
					<li className='text-[15px] font-semibold text-center'>O‘chirish</li>
				</ul>

				{loading ? (
					<div className='col-span-4 text-center py-10'>Yuklanmoqda...</div>
				) : shifts.length > 0 ? (
					shifts.map(item => (
						<ul
							key={item.id}
							className='col-span-4 grid grid-cols-6 items-center mt-5 gap-[20px]'
						>
							<li className='text-center'>{item.id}</li>
							<li className='text-center'>{item.name}</li>
							<li className='text-center'>{item.start_time}</li>
							<li className='text-center'>{item.end_time}</li>
							<li className='text-center'>
								<Button
									icon={<EditOutlined />}
									onClick={() => handleEdit(item)}
								/>
							</li>
							<li className='text-center'>
								<Button
									danger
									icon={<DeleteOutlined />}
									onClick={() => handleDelete(item.id!)}
								/>
							</li>
						</ul>
					))
				) : (
					<div className='col-span-4 h-[300px] flex justify-center items-center'>
						<Empty />
					</div>
				)}
			</div>
		</div>
	)
}

export default Smanalar
