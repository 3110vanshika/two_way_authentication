import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import VerifyOTP from './pages/VerifyOTP'
import VerifyEmail from './pages/VerifyEmail'
import ResetPassword from './pages/ResetPassword'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
         <Route path='/' element={<Signin />} />
         <Route path="/signup" element={<Signup />} />
         <Route path="/verifyOTP" element={<VerifyOTP />} />
         <Route path="/emailVerify" element={<VerifyEmail />} />
         <Route path="/resetPassword/:OTP" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App