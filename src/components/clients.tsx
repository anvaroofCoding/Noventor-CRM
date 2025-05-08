import { PlusOutlined } from '@ant-design/icons'
import {
	Button,
	Empty,
	Form,
	Image,
	Input,
	Modal,
	Select,
	Space,
	Upload,
} from 'antd'
import { useEffect, useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'

const Clients = () => {
	interface EmployeeItem {
		id?: number
		branch?: number | null
		name: string
		phone: string
		avatar?: File | null
		license_file?: File | null
		created_at?: string
		updated_at?: string
	}

	const [employ, setEmploy] = useState<EmployeeItem[]>([])
	const [son, setSon] = useState(1)
	const [open, setOpen] = useState(false)
	const [form] = Form.useForm()

	const handleOk = () => {
		form.submit()
	}

	const handleCancel = () => {
		setOpen(false)
	}

	const getPersons = async () => {
		const token = localStorage.getItem('access_token')
		if (!token) return
		try {
			const res = await fetch(
				'https://api.noventer.uz/api/v1/company/clients/',
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			)
			const data = await res.json()
			setEmploy(data.results)
		} catch (err) {
			console.error('Xodimlarni olishda xatolik:', err)
		}
	}

	useEffect(() => {
		getPersons()
	}, [son])

	const handleChange = (value: string) => {
		setSon(Number(value))
	}

	const onFinish = async (values: any) => {
		try {
			const token = localStorage.getItem('access_token')
			if (!token) return

			const formData = new FormData()
			formData.append('name', values.name)
			formData.append('phone', values.phone)
			formData.append('branch', values.branch)

			if (values.avatar?.file?.originFileObj) {
				formData.append('avatar', values.avatar.file.originFileObj)
			}
			if (values.license_file?.file?.originFileObj) {
				formData.append('license_file', values.license_file.file.originFileObj)
			}

			const res = await fetch(
				'https://api.noventer.uz/api/v1/company/clients/',
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				}
			)

			if (!res.ok) throw new Error(`Xatolik: ${res.status}`)

			await res.json()
			form.resetFields()
			setOpen(false)
			getPersons()
			console.log(res.body)
		} catch (err) {
			console.error('Yuborishda xatolik:', err)
		}
	}

	return (
		<div>
			<div className='w-full'>
				<div className='w-full py-[30px] flex justify-between items-center'>
					<Button
						type='primary'
						shape='round'
						icon={<PlusOutlined />}
						size={'middle'}
						onClick={() => setOpen(true)}
					>
						Mijoz Qo'shish
					</Button>
					<Modal
						title='Mijoz Qoshing'
						open={open}
						onOk={handleOk}
						onCancel={handleCancel}
						okText="Qo'shish"
					>
						<Form form={form} onFinish={onFinish} layout='vertical'>
							<Form.Item name='branch' label='Filial ID'>
								<Input type='number' placeholder='Masalan: 1' />
							</Form.Item>
							<Form.Item name='name' label='Ism'>
								<Input placeholder='Ismingizni kiriting' />
							</Form.Item>
							<Form.Item name='phone' label='Telefon'>
								<Input placeholder='Telefon raqamingiz' />
							</Form.Item>
							<Form.Item name='avatar' label='Avatar'>
								<Upload beforeUpload={() => false} listType='picture-card'>
									<PlusOutlined />
								</Upload>
							</Form.Item>
							<Form.Item name='license_file' label='License Fayl'>
								<Upload beforeUpload={() => false} listType='picture-card'>
									<PlusOutlined />
								</Upload>
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
				<div className='w-full border border-black/10 grid grid-cols-5 p-3'>
					<ul className='col-span-5 grid grid-cols-5 items-center gap-[30px]'>
						<li className='text-[15px] font-semibold text-center'>F.I.SH</li>
						<li className='text-[15px] font-semibold text-center'>Phone</li>
						<li className='text-[15px] font-semibold text-center'>Branch</li>
						<li className='text-[15px] font-semibold text-center'>
							Qabul vaqti
						</li>
						<li className='text-[15px] font-semibold text-center'>ID</li>
					</ul>
					{employ.length > 0 ? (
						employ.map((item, index) => (
							<ul
								key={index}
								className='col-span-6 grid grid-cols-5 items-center mt-5 gap-[30px]'
							>
								<li className='text-center mt-2 flex justify-center items-center gap-[5px]'>
									{item.avatar ? (
										<Image
											src={item.avatar}
											width={40}
											className='rounded-full'
										/>
									) : (
										<span className='text-gray-400'>No image</span> // yoki placeholder qo‘ying
									)}
									{item.name}
								</li>
								<li className='text-center mt-2'>{item.phone}</li>
								<li className='text-center mt-2'>{item.branch}</li>
								<li className='text-center mt-2'>{item.created_at}</li>
								<li className='text-center mt-2'>{item.id}</li>
							</ul>
						))
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

export default Clients
