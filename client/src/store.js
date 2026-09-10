import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import goalReducer from './features/goal/goalSlice'
import paymentReducer from './features/payment/paymentSlice'


export const store = configureStore({
  reducer: {
    auth: authReducer,
    goals: goalReducer,
    payment: paymentReducer,
  },
})