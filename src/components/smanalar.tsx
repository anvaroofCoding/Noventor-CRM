import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import {
	Button,
	Empty,
	Form,
	Input,
	message,
	Modal,
	Select,
	Space,
	TimePicker,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'

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

	const [form] = Form.useForm()
	const [shifts, setShifts] = useState<ShiftItem[]>([])
	const [branchId, setBranchId] = useState(1)
	const [open, setOpen] = useState(false)
	const [editId, setEditId] = useState<number | null>(null)
	const token = localStorage.getItem('access_token')

	const fetchShifts = async () => {
		if (!token) return
		try {
			const res = await fetch(
				`https://api.noventer.uz/api/v1/company/shift-detail/3/`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			)
			const data = await res.json()
			const builtData = []
			builtData.push(data)
			setShifts(builtData)
		} catch (err) {
			message.error('Smenalarni olishda xatolik')
		}
	}

	const createShift = async (
		payload: Omit<ShiftItem, 'id' | 'branch_name' | 'created_at' | 'updated_at'>
	) => {
		const res = await fetch(
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

		let current = [...shifts]
		current.push(payload)
		setShifts(current)
		console.log(payload)
		console.log(shifts)
		return res.ok
	}

	const updateShift = async (
		id: number,
		payload: Omit<ShiftItem, 'id' | 'branch_name' | 'created_at' | 'updated_at'>
	) => {
		const res = await fetch(
			`https://api.noventer.uz/api/v1/company/shift-detail/${id}/`,
			{
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			}
		)
		return res.ok
	}

	useEffect(() => {
		fetchShifts()
	}, [branchId])

	const handleChange = (value: string) => {
		setBranchId(Number(value))
	}

	const handleOk = () => form.submit()

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
			const success = editId
				? await updateShift(editId, payload)
				: await createShift(payload)
			if (!success) throw new Error()
			message.success(`Smena ${editId ? 'tahrirlandi' : "qo'shildi"}`)
			form.resetFields()
			setOpen(false)
			setEditId(null)
			fetchShifts()
		} catch (err) {
			message.error('Saqlashda xatolik')
		}
	}

	const handleEdit = (item: ShiftItem) => {
		setOpen(true)
		setEditId(item.id)
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
			message.success('Ochirildi')
			fetchShifts()
		} catch {
			message.error('Ochirishda xatolik')
		}
	}

	return (
		<div>
			<div>
				<div className='w-full'>
					<div className='w-full py-[30px] flex justify-between items-center'>
						<Button
							type='primary'
							shape='round'
							icon={<PlusOutlined />}
							onClick={() => setOpen(true)}
						>
							Smena qo'shish
						</Button>
						<Modal
							title='Smena qo’shish'
							open={open}
							onOk={handleOk}
							onCancel={handleCancel}
							okText={editId ? 'Saqlash' : "Qo'shish"}
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
									rules={[{ required: true, message: 'Smena nomi majburiy' }]}
								>
									<Input />
								</Form.Item>

								<Form.Item
									name='start_time'
									label='Boshlanish vaqti'
									rules={[
										{ required: true, message: 'Boshlanish vaqti kerak' },
									]}
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
						<div className='flex gap-3'>
							<Input
								placeholder='Qidirish...'
								prefix={<IoSearchOutline />}
								style={{ width: 300 }}
							/>
							<Space wrap>
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
							</Space>
						</div>
					</div>
					<div className='w-full border border-black/10 grid grid-cols-4 p-3'>
						<ul className='col-span-4 grid grid-cols-6 items-center gap-[20px]'>
							<li className='text-[15px] font-semibold text-center'>ID</li>
							<li className='text-[15px] font-semibold text-center'>Smena</li>
							<li className='text-[15px] font-semibold text-center'>
								Boshlanish
							</li>
							<li className='text-[15px] font-semibold text-center'>
								Tugatish
							</li>
							<li className='text-[15px] font-semibold text-center'>
								Tahrirlash
							</li>
							<li className='text-[15px] font-semibold text-center'>
								O'chirish
							</li>
						</ul>
						{shifts.length > 0 ? (
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
											onClick={() => handleDelete(item.id)}
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
			</div>
		</div>
	)
}

export default Smanalar
