import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const RegistrationForm = ({ setloggedIn }) => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [generatedOtp, setGeneratedOtp] = useState(null);
    const navigate = useNavigate();

    const mobile = watch("mobile");

    const handleOtpSend = () => {
        const generated = Math.floor(100000 + Math.random() * 900000);
        setGeneratedOtp(generated);
        setOtpSent(true);
        console.log("Generated OTP:", generated);
    };

    const handleOtpVerify = () => {
        if (otp === generatedOtp?.toString()) {
            alert("Login Successful");
            setloggedIn(mobile);
            navigate('/home', { state: { mobile } });
        } else {
            alert("Invalid OTP. Please try again.");
        }
    };

    const check_account = async () => {
      console.log(mobile)
        try {
            const response = await fetch('http://localhost:3000/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mobile }),
            });

            if (response.ok) {
                const data = await response.json();
                await console.log('Server Response:', data);
            } else {
                console.error('Failed to process request:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const onSubmit = async (data) => {
        console.log("Form Submitted:", data);
        await check_account();
    };

    return (
        <div className="max-w-md mx-auto p-6 border rounded-lg bg-white shadow-md">
            <h2 className="text-xl font-bold mb-6 text-center">Register</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                    <input
                        type="tel"
                        id="mobile"
                        {...register("mobile", {
                            required: "Mobile number is required",
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Please enter a valid 10-digit mobile number",
                            },
                        })}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
                </div>

                {otpSent && (
                    <div className="mb-4">
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Enter OTP</label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={handleOtpVerify}
                            className="mt-2 w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Verify OTP
                        </button>
                    </div>
                )}

                {!otpSent && (
                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={handleOtpSend}
                            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Send OTP
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600 mt-4"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegistrationForm;
