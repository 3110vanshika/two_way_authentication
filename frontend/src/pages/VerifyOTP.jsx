import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyOTP = () => {
    const [otp, setOtp] = useState(Array(6).fill('')); // State to hold OTP digits

    // Handle input change
    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/^\d$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (index < 5) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
            document.getElementById(`otp-input-${index - 1}`).focus();
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');
        try {
            const response = await axios.post('http://localhost:3000/api/auth/verifyOTP', { OTP: otpCode }, { withCredentials: true });
            if (response.status === 200) {
                toast.success(response?.data?.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    return (
        <>
            <div className="flex items-center justify-center h-screen">
                <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
                    <header className="mb-8">
                        <h1 className="text-2xl font-bold mb-1">OTP Verification</h1>
                        <p className="text-[15px] text-slate-500">Enter the 6-digit verification code sent to your email.</p>
                    </header>
                    <form id="otp-form" onSubmit={handleSubmit}>
                        <div className="flex items-center justify-center gap-3">
                            {otp.map((_, index) => (
                                <input
                                    key={index}
                                    id={`otp-input-${index}`}
                                    type="text"
                                    className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                    maxLength="1"
                                    value={otp[index]}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                />
                            ))}
                        </div>
                        <div className="max-w-[260px] mx-auto mt-4">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600"
                            >
                                Verify Account
                            </button>
                        </div>
                    </form>
                    <div className="text-sm text-slate-500 mt-4">
                        Didn't receive code?{' '}
                        <Link className="font-medium text-indigo-500 hover:text-indigo-600" to="#">
                            Resend
                        </Link>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default VerifyOTP;
