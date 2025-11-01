import React, { useState } from 'react'
import { Eye, EyeOff, Lock, LogIn, Mail, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import { useDispatch } from 'react-redux';
import { addUser } from '../../utils/slice/userSlice';
import { toast } from 'react-toastify';
import { addRequests } from '../../utils/slice/requestSlice';
import { addSentRequests } from '../../utils/slice/sentRequestSlice';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            setLoginLoading(true);
            const response = await axios.post(BASE_URL + '/login', {
                email: formData.email,
                password: formData.password
            }, { withCredentials: true });

            if (response.data) {
                dispatch(addUser(response.data));
                const receivedRequestsData = await axios.get(BASE_URL + '/user/requests/received', { withCredentials: true });
                dispatch(addRequests(receivedRequestsData?.data?.data));

                const sentRequestsData = await axios.get(BASE_URL + '/user/requests/sent', { withCredentials: true });
                dispatch(addSentRequests(sentRequestsData?.data?.data));
                toast.success('Welcome back! 🎉', {
                    position: 'top-center',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                });
                navigate('/');
            }
        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || 'Invalid credentials. Please try again.';
            toast.error(errorMessage, {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
            });
            setLoginLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-3 sm:p-4 md:p-6 py-8 sm:py-4">
            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-4 sm:mb-6 md:mb-8 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full shadow-2xl mb-2 sm:mb-3 md:mb-4">
                        <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-purple-600" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2 px-2">Welcome Back</h1>
                    <p className="text-white text-sm sm:text-base md:text-lg opacity-90 px-4">Sign in to continue your journey</p>
                </div>

                <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 animate-fade-in-up">
                    <h2 className="text-xl sm:text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-5 sm:mb-6">
                        Sign In
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                                Email Address *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-black" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`w-full text-sm sm:text-base text-black pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.email
                                        ? 'border-red-500'
                                        : 'border-gray-200 focus:border-purple-500'
                                        }`}
                                    placeholder="john@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-black" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className={`w-full text-sm sm:text-base text-black pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.password
                                        ? 'border-red-500'
                                        : 'border-gray-200 focus:border-purple-500'
                                        }`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 sm:top-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                                    ) : (
                                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between gap-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <span className="ml-2 text-xs sm:text-sm text-gray-600">Remember me</span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-xs sm:text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors whitespace-nowrap"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full flex items-center justify-center cursor-pointer gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-sm sm:text-base hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loginLoading ? (
                                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                            {loginLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-5 sm:mt-6">
                        <div className="relative my-4 sm:my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-xs sm:text-sm">
                                <span className="px-3 sm:px-4 bg-white text-gray-500">or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <button
                                type="button"
                                className="flex items-center justify-center cursor-pointer gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl font-medium text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-all duration-300"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <span className="truncate">Google</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center cursor-pointer text-black gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl font-medium text-xs sm:text-sm hover:bg-gray-50 transition-all duration-300 hover:border-gray-300"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="#1877F2" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                <span className="truncate">Facebook</span>
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center text-white text-sm sm:text-base mt-5 sm:mt-6 px-4">
                    Don't have an account?{' '}
                    <Link
                        to="/signup"
                        className="font-semibold underline text-sm sm:text-base text-gray-800 hover:bg-gradient-to-r hover:from-fuchsia-500 hover:to-indigo-500 hover:bg-clip-text hover:text-transparent transition-colors"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login;