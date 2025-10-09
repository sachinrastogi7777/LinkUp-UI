import { useState } from 'react';
import { Mail, ArrowLeft, Check, KeyRound, Lock, RefreshCw } from 'lucide-react';
import { BASE_URL } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (value, field) => {
        if (field === 'email') setEmail(value);
        if (field === 'otp') setOtp(value);
        if (field === 'newPassword') setNewPassword(value);
        if (field === 'confirmPassword') setConfirmPassword(value);

        if (error) setError('');
        if (success) setSuccess('');
    };

    const validateEmail = () => {
        if (!email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const validatePasswords = () => {
        if (!newPassword) {
            setError('Password is required');
            return false;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    // Step 1: Send OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();

        if (!validateEmail()) return;

        try {
            setLoading(true);
            const response = await axios.post(`${BASE_URL}/forgot-password`, { email }, { withCredentials: true });
            if (response && response.status === 200) {
                setStep(2);
                setSuccess('OTP sent to your email! 📧');
            } else {
                const body = response?.data;
                setError(body?.message || body?.error || JSON.stringify(body) || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            if (err && err.response) {
                const body = err.response.data;
                setError(body?.message || body?.error || JSON.stringify(body) || 'Failed to send OTP. Please try again.');
            } else {
                setError('Failed to send OTP. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${BASE_URL}/verify-otp`, { email, otp }, { withCredentials: true });
            if (response && response.status === 200) {
                setStep(3);
                setSuccess('OTP verified successfully! ✅');
            } else {
                const body = response?.data;
                setError(body?.message || body?.error || JSON.stringify(body) || 'Invalid or expired OTP');
            }
        } catch (err) {
            if (err && err.response) {
                const body = err.response.data;
                setError(body?.message || body?.error || JSON.stringify(body) || 'Invalid or expired OTP');
            } else {
                setError('Failed to verify OTP. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const response = await axios.post(`${BASE_URL}/resend-otp`, { email }, { withCredentials: true });
            if (response && response.status === 200) {
                setStep(2);
                setSuccess('New OTP sent to your email! 📧');
            } else {
                const body = response?.data;
                setError(body?.message || body?.error || JSON.stringify(body) || 'Failed to resend OTP.');
            }
        } catch (err) {
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!validatePasswords()) return;

        try {
            setLoading(true);
            const response = await axios.post(`${BASE_URL}/reset-password`, { email, newPassword }, { withCredentials: true });
            if (response && response.status === 200) {
                setStep(4);
                setSuccess('Password reset successfully! 🎉');
            } else {
                const body = response?.data;
                setError(body?.message || body?.error || JSON.stringify(body) || 'Failed to reset password. Please try again.');
            }
        } catch (err) {
            setError('Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        // Reset all states
        setStep(1);
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setSuccess('');
        navigate('/login');
    };

    const getStepTitle = () => {
        switch (step) {
            case 1: return 'Forgot Password?';
            case 2: return 'Verify OTP';
            case 3: return 'Create New Password';
            case 4: return 'Success!';
            default: return 'Reset Password';
        }
    };

    const getStepDescription = () => {
        switch (step) {
            case 1: return "No worries, we'll send you an OTP";
            case 2: return 'Enter the 6-digit code we sent to your email';
            case 3: return 'Choose a strong password for your account';
            case 4: return 'Your password has been reset successfully';
            default: return '';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
            <div className="relative z-10 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-2xl mb-4">
                        <KeyRound className="w-10 h-10 text-purple-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                        {getStepTitle()}
                    </h1>
                    <p className="text-white text-lg opacity-90">
                        {getStepDescription()}
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
                    {/* Success Message */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            {success}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Email Input */}
                    {step === 1 && (
                        <>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                                Reset Password
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-600" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => handleInputChange(e.target.value, 'email')}
                                            className={`w-full text-black pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${error
                                                ? 'border-red-500'
                                                : 'border-gray-200 focus:border-purple-500'
                                                }`}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Enter the email address associated with your account
                                    </p>
                                </div>

                                <button
                                    onClick={handleSendOTP}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Mail className="w-5 h-5" />
                                    )}
                                    {loading ? 'Sending...' : 'Send OTP'}
                                </button>
                            </div>
                        </>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 2 && (
                        <>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                                Enter OTP
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Verification Code *
                                    </label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => handleInputChange(e.target.value.replace(/\D/g, '').slice(0, 6), 'otp')}
                                        className={`w-full text-black px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-center text-2xl tracking-widest ${error
                                            ? 'border-red-500'
                                            : 'border-gray-200 focus:border-purple-500'
                                            }`}
                                        placeholder="000000"
                                        maxLength={6}
                                    />
                                    <p className="text-gray-500 text-sm mt-2">
                                        OTP sent to {email}
                                    </p>
                                </div>

                                <button
                                    onClick={handleVerifyOTP}
                                    disabled={loading || otp.length !== 6}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Check className="w-5 h-5" />
                                    )}
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </button>

                                <button
                                    onClick={handleResendOTP}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    Resend OTP
                                </button>
                            </div>
                        </>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                                New Password
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password *
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-600" />
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => handleInputChange(e.target.value, 'newPassword')}
                                            className={`w-full text-black pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${error
                                                ? 'border-red-500'
                                                : 'border-gray-200 focus:border-purple-500'
                                                }`}
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password *
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-600" />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => handleInputChange(e.target.value, 'confirmPassword')}
                                            className={`w-full text-black pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${error
                                                ? 'border-red-500'
                                                : 'border-gray-200 focus:border-purple-500'
                                                }`}
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Password must be at least 6 characters
                                    </p>
                                </div>

                                <button
                                    onClick={handleResetPassword}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <KeyRound className="w-5 h-5" />
                                    )}
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </div>
                        </>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <div className="text-center space-y-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Password Reset Complete!
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    Your password has been successfully reset.
                                </p>
                                <p className="text-sm text-gray-500">
                                    You can now sign in with your new password.
                                </p>
                            </div>

                            <button
                                onClick={handleBackToLogin}
                                className="w-full flex items-center justify-center gap-2 cursor-pointer px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Back to Sign In
                            </button>
                        </div>
                    )}

                    {step < 4 && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={handleBackToLogin}
                                className="flex items-center justify-center gap-2 cursor-pointer text-gray-600 hover:text-gray-800 font-medium transition-colors w-full"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Sign In
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {step === 1 && (
                    <p className="text-center text-white mt-6">
                        Don't have an account?{' '}
                        <button
                            onClick={() => alert('Redirecting to signup...')}
                            className="font-semibold underline text-sm hover:text-gray-100 transition-colors"
                        >
                            Sign Up
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;