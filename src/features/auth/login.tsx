import { Button, Form, Input, message } from 'antd'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/images/logo.svg'
import noventor from '../../assets/images/noventor.png'

interface LoginFormValues {
	phone_number: string
	password: string
}

const Login = () => {
	const navigate = useNavigate()
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)

	const handleFinish = async (values: LoginFormValues) => {
		setLoading(true)
		try {
			const response = await axios.post(
				'https://api.noventer.uz/api/v1/accounts/login/',
				{
					phone_number: values.phone_number,
					password: values.password,
				}
			)

			message.success('Muvaffaqiyatli login!')
			console.log('Token:', response.data)
			console.log('Token:', response?.data?.data?.tokens?.access)
			// console.log('Token:', response.data.access)
			// Tokenni localStorage'ga saqlash:
			localStorage.setItem('access_token', response?.data?.data?.tokens?.access)
			localStorage.setItem(
				'refrush_token',
				response?.data?.data?.tokens?.refresh
			)
			navigate('/')
		} catch (error: any) {
			console.error('Login xatosi:', error)
			message.error('Login yoki parol noto‘g‘ri!')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='grid xl:grid-cols-2 grid-cols-1 h-screen'>
			<div>
				<img
					src={noventor}
					alt='noventor'
					className='h-full w-full object-cover'
				/>
			</div>
			<div className='flex justify-center items-center'>
				<div className='w-[80%] flex flex-col gap-8'>
					<div className='flex flex-col items-center justify-center'>
						<img src={logo} alt='logo' />
						<h1 className='font-bold text-3xl'>NovEnter</h1>
						<p className='text-trillioner'>
							CRM tizim bilan biznesingizni rivojlantiring
						</p>
					</div>

					<Form
						form={form}
						layout='vertical'
						onFinish={handleFinish}
						autoComplete='off'
					>
						<Form.Item
							label='Telefon raqam'
							name='phone_number'
							rules={[
								{ required: true, message: 'Telefon raqamingizni kiriting!' },
								{
									// pattern: /^\d{9}$/,
									message: 'Faqat 9 ta raqam kiriting (masalan: 901234567)',
								},
							]}
						>
							<Input
								type='text'
								placeholder='+998XXXXXXXXX'
								size='large'
								// maxLength={9}
							/>
						</Form.Item>

						<Form.Item
							label='Parol'
							name='password'
							rules={[{ required: true, message: 'Parol kiriting!' }]}
						>
							<Input.Password placeholder='Parolingiz' size='large' />
						</Form.Item>

						<Form.Item>
							<Button
								type='primary'
								htmlType='submit'
								loading={loading}
								block
								size='large'
							>
								Kirish
							</Button>
						</Form.Item>
					</Form>
				</div>
			</div>
		</div>
	)
}

export default Login
