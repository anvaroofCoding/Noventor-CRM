import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import {
	Button,
	Empty,
	Form,
	Image,
	Input,
	message,
	Modal,
	Pagination,
	Popconfirm,
	Upload,
} from 'antd'
import { useEffect, useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'

const PAGE_SIZE = 10

const Clients = () => {
	interface EmployeeItem {
		id?: number
		branch?: number | null
		name: string
		phone: string
		avatar?: string
		license_file?: string
		created_at?: string
		updated_at?: string
	}

	const [employ, setEmploy] = useState<EmployeeItem[]>([])
	const [open, setOpen] = useState(false)
	const [form] = Form.useForm()
	const [editId, setEditId] = useState<number | null>(null)
	const [editAvatar, setEditAvatar] = useState<string | undefined>()
	const [editLicense, setEditLicense] = useState<string | undefined>()
	const [page, setPage] = useState(1)
	const [total, setTotal] = useState(0)
	const [avatarList, setAvatarList] = useState<any[]>([])
	const [searchText, setSearchText] = useState('')

	const handleOk = () => {
		form.submit()
	}

	const handleCancel = () => {
		setOpen(false)
		setEditId(null)
		form.resetFields()
		setEditAvatar(undefined)
		setEditLicense(undefined)
	}

	const getPersons = async () => {
		const token = localStorage.getItem('access_token')
		if (!token) return
		try {
			const offset = (page - 1) * PAGE_SIZE
			const searchParam = searchText ? `&search=${searchText}` : ''
			const res = await fetch(
				`https://api.noventer.uz/api/v1/company/clients/?limit=${PAGE_SIZE}&offset=${offset}${searchParam}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				}
			)
			const data = await res.json()
			setEmploy(data.results)
			setTotal(data.count)
		} catch (err) {
			console.error('Xodimlarni olishda xatolik:', err)
		}
	}

	useEffect(() => {
		getPersons()
	}, [page])

	const onFinish = async (values: any) => {
		try {
			const token = localStorage.getItem('access_token')
			if (!token) return

			const formData = new FormData()
			formData.append('name', values.name)
			formData.append('phone', values.phone)
			formData.append('branch', String(values.branch))

			if (avatarList.length > 0 && avatarList[0].originFileObj) {
				formData.append('avatar', avatarList[0].originFileObj)
			}
			if (values.license_file?.file?.originFileObj) {
				formData.append('license_file', values.license_file.file.originFileObj)
			}

			let res
			if (editId) {
				res = await fetch(
					`https://api.noventer.uz/api/v1/company/clients/${editId}/`,
					{
						method: 'PUT',
						headers: { Authorization: `Bearer ${token}` },
						body: formData,
					}
				)
			} else {
				res = await fetch('https://api.noventer.uz/api/v1/company/clients/', {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				})
			}

			if (!res.ok) throw new Error(`Xatolik: ${res.status}`)

			await res.json()
			form.resetFields()
			setOpen(false)
			setEditId(null)
			getPersons()
		} catch (err) {
			console.error('Yuborishda xatolik:', err)
		}
	}

	const handleEdit = (item: EmployeeItem) => {
		setEditId(item.id!)
		setEditAvatar(item.avatar)
		setEditLicense(item.license_file)
		form.setFieldsValue({
			name: item.name,
			phone: item.phone,
			branch: item.branch,
			avatar: [],
			license_file: [],
		})
		setOpen(true)
	}

	const handleDelete = async (id: number) => {
		const token = localStorage.getItem('access_token')
		if (!token) return
		try {
			const res = await fetch(
				`https://api.noventer.uz/api/v1/company/clients/${id}/`,
				{
					method: 'DELETE',
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			if (!res.ok) throw new Error()
			message.success('Mijoz o‘chirildi')
			getPersons()
		} catch {
			message.error('O‘chirishda xatolik')
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
						tokText={editId ? 'Saqlash' : "Qo'shish"}
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
								<Upload
									beforeUpload={() => false}
									listType='picture-card'
									fileList={avatarList}
									onChange={({ fileList }) => setAvatarList(fileList)}
								>
									{avatarList.length >= 1 ? null : <PlusOutlined />}
								</Upload>
							</Form.Item>
							<Form.Item name='license_file' label='License Fayl'>
								<Upload beforeUpload={() => false} listType='picture-card'>
									{editLicense ? (
										<Image src={editLicense} width={40} />
									) : (
										<PlusOutlined />
									)}
								</Upload>
							</Form.Item>
						</Form>
					</Modal>
					<div className='flex gap-3'>
						<Input
							placeholder='Qidirish...'
							prefix={<IoSearchOutline />}
							style={{ width: 300 }}
							value={searchText}
							onChange={e => setSearchText(e.target.value)}
							onPressEnter={() => {
								setPage(1)
								getPersons()
							}}
						/>
					</div>
				</div>
				<div className='w-full border border-black/10 grid grid-cols-5 p-3'>
					<ul className='col-span-5 grid grid-cols-6 items-center gap-[30px]'>
						<li className='text-[15px] font-semibold text-center'>F.I.SH</li>
						<li className='text-[15px] font-semibold text-center'>Phone</li>
						<li className='text-[15px] font-semibold text-center'>Branch</li>
						<li className='text-[15px] font-semibold text-center'>
							Qabul vaqti
						</li>
						<li className='text-[15px] font-semibold text-center'>ID</li>
						<li className='text-[15px] font-semibold text-center'>Amallar</li>
					</ul>
					{employ.length > 0 ? (
						employ.map((item, index) => (
							<ul
								key={index}
								className='col-span-6 grid grid-cols-6 items-center mt-5 gap-[30px]'
							>
								<li className='text-center mt-2 flex justify-center items-center gap-[5px]'>
									{item.avatar ? (
										<Image
											src={item.avatar}
											width={40}
											className='rounded-full'
										/>
									) : (
										<span className='text-gray-400'>No image</span>
									)}
									{item.name}
								</li>
								<li className='text-center mt-2'>{item.phone}</li>
								<li className='text-center mt-2'>{item.branch}</li>
								<li className='text-center mt-2'>{item.created_at}</li>
								<li className='text-center mt-2'>{item.id}</li>
								<li className='text-center mt-2 flex justify-center gap-2'>
									<Button
										icon={<EditOutlined />}
										onClick={() => handleEdit(item)}
									/>
									<Popconfirm
										title='Rostdan ham o‘chirmoqchimisiz?'
										onConfirm={() => handleDelete(item.id!)}
									>
										<Button danger icon={<DeleteOutlined />} />
									</Popconfirm>
								</li>
							</ul>
						))
					) : (
						<div className='flex justify-center items-center w-full h-[400px] col-span-6'>
							<Empty />
						</div>
					)}
				</div>
			</div>
			<div className='flex justify-center my-5'>
				<Pagination
					current={page}
					total={total}
					pageSize={PAGE_SIZE}
					onChange={p => setPage(p)}
				/>
			</div>
		</div>
	)
}

export default Clients
