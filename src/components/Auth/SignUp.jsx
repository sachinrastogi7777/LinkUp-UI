import React, { useState, useRef } from 'react';
import { User, Mail, Lock, Phone, MapPin, Calendar, Camera, Sparkles, ArrowRight, ArrowLeft, Check, Eye, EyeOff, Upload, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import { uploadImageToServer } from '../../utils/helper';
import { useDispatch } from 'react-redux';
import { addUser } from '../../utils/slice/userSlice';

const SignUp = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [createLoading, setCreateLoading] = useState(false);
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        userName: '',
        dateOfBirth: '',
        gender: '',
        mobileNumber: '',
        location: '',
        interests: [],
        about: '',
        profileImage: null
    });

    const [errors, setErrors] = useState({});
    const [newInterest, setNewInterest] = useState('');

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload a valid image file.', {
                    position: 'top-center',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                });
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size exceeds 10MB. Please upload a smaller image.', {
                    position: 'top-center',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                });
                return;
            }
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImage(reader.result); // base64 string
            setProfileImageFile(file); //store file for upload
            setFormData(prev => ({ ...prev, profileImage: file }));
            console.log(profileImage)
        }
        reader.readAsDataURL(file); // Converts to base64
    }

    const handleAddInterest = () => {
        if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
            handleInputChange('interests', [...formData.interests, newInterest.trim()]);
            setNewInterest('');
        }
    };

    const handleRemoveInterest = (interest) => {
        handleInputChange('interests', formData.interests.filter(i => i !== interest));
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (!formData.userName.trim()) newErrors.userName = 'Username is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
        else if (!/^\+?[\d\s-()]+$/.test(formData.mobileNumber)) newErrors.mobileNumber = 'Invalid mobile number';
        if (!formData.location.trim()) newErrors.location = 'Location is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
        } else if (currentStep === 2 && validateStep2()) {
            setCurrentStep(3);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(1, prev - 1));
    };

    const handleSubmit = async () => {
        try {
            setCreateLoading(true);
            let profileImageUrl = profileImage;
            if (profileImage) {
                profileImageUrl = await uploadImageToServer(profileImageFile, 'profile');
            }
            const newUser = await axios.post(`${BASE_URL}/signup`, { ...formData, profileImage: profileImageUrl }, { withCredentials: true });
            if (newUser.data) {
                dispatch(addUser(newUser.data.data))
                setTimeout(() => {
                    navigate('/profile');
                    toast.success('Welcome to the world of LinkUp 🎉', {
                        position: 'top-center',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: false,
                        draggable: false,
                    });
                }, 2000);
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong !!! 🫨 . Please try again.', {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
            });
            setTimeout(() => {
                setCreateLoading(false);
            }, 2000)
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
            <div className="relative z-10 w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-2xl mb-4">
                        <Sparkles className="w-10 h-10 text-purple-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Join Our Community</h1>
                    <p className="text-white text-lg opacity-90">Create your account in 3 simple steps</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300 ${currentStep >= step
                                    ? 'bg-white text-purple-600 shadow-lg scale-110'
                                    : 'bg-white bg-opacity-30 text-black'
                                    }`}>
                                    {currentStep > step ? <Check className="w-5 h-5" /> : step}
                                </div>
                                {step < 3 && (
                                    <div className={`w-16 md:w-32 h-1 mx-2 transition-all duration-500 ${currentStep > step ? 'bg-white' : 'bg-white bg-opacity-30'
                                        }`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-white text-sm font-medium">
                        <span>Account</span>
                        <span>Details</span>
                        <span>Profile</span>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 animate-fade-in-up">
                    {/* Step 1: Account Basics */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                                Account Basics
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 w-5 h-5 text-black" />
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            className={`w-full text-black pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                                                }`}
                                            placeholder="John"
                                        />
                                    </div>
                                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 w-5 h-5 text-black" />
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            className={`w-full text-black pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                                                }`}
                                            placeholder="Doe"
                                        />
                                    </div>
                                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-black" />
                                    <input
                                        type="text"
                                        value={formData.userName}
                                        onChange={(e) => handleInputChange('userName', e.target.value)}
                                        className={`w-full text-black pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.userName ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                                            }`}
                                        placeholder="johndoe123"
                                    />
                                </div>
                                {errors.userName && <p className="text-red-500 text-sm mt-1">{errors.userName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-black" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={`w-full text-black pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                                            }`}
                                        placeholder="john@example.com"
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-black" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className={`w-full text-black pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                                            }`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Personal Details */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                                Personal Details
                            </h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-800 pointer-events-none" />
                                    <input
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                        className={`w-full text-black pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'}`}
                                    />
                                </div>
                                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-black pointer-events-none" />
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        className={`w-full text-black pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors appearance-none cursor-pointer ${errors.gender ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                                            }`}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 w-5 h-5 text-black" />
                                    <input
                                        type="tel"
                                        value={formData.mobileNumber}
                                        onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                                        className={`w-full text-black pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.mobileNumber ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                                            }`}
                                        placeholder="+91 (555) 444-2222"
                                    />
                                </div>
                                {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-black" />
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        className={`w-full text-black pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.location ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                                            }`}
                                        placeholder="New York, USA"
                                    />
                                </div>
                                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Profile Setup */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                                Complete Your Profile
                            </h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative group">
                                        {profileImage ? (
                                            <img
                                                src={profileImage}
                                                alt="Profile Preview"
                                                className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 shadow-lg"
                                            />
                                        ) : (
                                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center border-4 border-purple-300">
                                                <Camera className="w-12 h-12 text-purple-600" />
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-all duration-300 flex items-center justify-center"
                                        >
                                            <Upload className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors"
                                    >
                                        {profileImage ? 'Change Photo' : 'Upload Photo'}
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {formData.interests.map((interest, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium"
                                        >
                                            {interest}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveInterest(interest)}
                                                className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-purple-200 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newInterest}
                                        onChange={(e) => setNewInterest(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                                        placeholder="Add interest..."
                                        className="flex-1 text-black px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddInterest}
                                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">About You</label>
                                <textarea
                                    value={formData.about}
                                    onChange={(e) => handleInputChange('about', e.target.value)}
                                    rows={4}
                                    className="w-full text-black px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                        {currentStep > 1 && (
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </button>
                        )}

                        {currentStep < 3 ? (
                            <button
                                onClick={handleNext}
                                className="ml-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Next
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={createLoading}
                                className="ml-auto flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                {createLoading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Check className="w-4 h-4" />
                                )}
                                {createLoading ? `Creating Profile` : `Create Account`}
                            </button>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-white mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold underline text-sm text-gray-800 hover:bg-gradient-to-r hover:from-fuchsia-500 hover:to-indigo-500 hover:bg-clip-text hover:text-transparent transition-colors">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;