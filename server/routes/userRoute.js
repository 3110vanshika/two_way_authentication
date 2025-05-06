const express = require('express');
const { userSignup, userSignin, verifyOTP, verifyEmail, resetPassword } = require('../controllers/userController');

const router = express.Router();

// user signup
router.post('/signup', userSignup)

// user signin
router.post('/signin', userSignin)

// verify OTP
router.post('/verifyOTP', verifyOTP)

// verify email
router.post('/verifyEmail', verifyEmail)

// reset password
router.post('/resetPassword/:OTP', resetPassword)

module.exports = router;