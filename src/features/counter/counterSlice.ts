import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
	id: number
	full_name: string
	birth_date: string // YYYY-MM-DD
	gender: 'male' | 'female' | string
	email: string
	avatar: string
	face_id: string | null
	company_id: number
	role: string
	salary_type: string
}

const initialState: UserState = {
	id: 0,
	full_name: '',
	birth_date: '',
	gender: '',
	email: '',
	avatar: '',
	face_id: null,
	company_id: 0,
	role: '',
	salary_type: '',
}

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<UserState>) => {
			// return action.payload
			console.log(action.payload)
		},
	},
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
