import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios';
import { AtSign, Camera, ChevronDown, Heart, Mail, MapPin, Phone, Save, Upload, User, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../utils/constants';
import { addUser } from '../../utils/slice/userSlice';
import { uploadImageToServer } from '../../utils/helper';

const EditProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userData = useSelector((store) => store.user);
    const [formData, setFormData] = useState(userData);
    const [isSaveLoading, setIsSaveLoding] = useState(false);
    const [activeSection, setActiveSection] = useState('basic');
    const [coverImage, setCoverImage] = useState(userData?.coverImage || null);
    const [profileImage, setProfileImage] = useState(userData?.profileImage || null);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [newInterest, setNewInterest] = useState('');

    const coverFileRef = useRef(null);
    const profileFileRef = useRef(null);

    useEffect(() => {
        if (!formData || Object.keys(formData).length === 0 || formData === userData) {
            setFormData(userData);
            setCoverImage(userData?.coverImage || null);
            setProfileImage(userData?.profileImage || null);
        }
    }, [userData]);

    const formatDateForInput = (date) => {
        if (!date) return '';
        if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) return date;
        const d = new Date(date);
        if (isNaN(d)) return '';
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const handleImageUpload = (type, event) => {
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
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('File size should be less than 5MB.', {
                    position: 'top-center',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'profile') {
                    setProfileImage(reader.result); // base64 string
                    setProfileImageFile(file); // store file for upload
                } else {
                    setCoverImage(reader.result); // base64 string
                    setCoverImageFile(file); // store file for upload
                }
            };
            reader.readAsDataURL(file); // convert to base64 string
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddInterest = () => {
        if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
            handleInputChange('interests', [...formData.interests, newInterest.trim()]);
            setNewInterest('');
        }
    };

    const handleRemoveInterest = (interest) => {
        handleInputChange('interests', formData.interests.filter(i => i !== interest));
    };

    const isFormUnchanged = () => {
        if (!userData) return false;
        const fields = [
            'firstName', 'lastName', 'about', 'dateOfBirth', 'mobileNumber', 'location', 'gender'
        ];
        for (const field of fields) {
            if (formData[field] !== userData[field]) return false;
        }
        if (Array.isArray(formData.interests) && Array.isArray(userData.interests)) {
            if (formData.interests.length !== userData.interests.length ||
                formData.interests.some((v, i) => v !== userData.interests[i])) {
                return false;
            }
        } else if (formData.interests !== userData.interests) {
            return false;
        }
        if (profileImage !== userData.profileImage) return false;
        if (coverImage !== userData.coverImage) return false;
        if (profileImageFile || coverImageFile) return false;
        return true;
    };

    const handleSave = async () => {
        if (isFormUnchanged()) {
            toast.info('Profile is already updated.', {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
            });
            return;
        }
        try {
            setIsSaveLoding(true);
            let profileImageUrl = profileImage;
            let coverImageUrl = coverImage;
            if (profileImageFile) {
                toast.info('Uploading Profile Image...', {
                    position: 'top-center',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                });
                profileImageUrl = await uploadImageToServer(profileImageFile, 'profile');
            }
            if (coverImageFile) {
                toast.info('Uploading Cover Image...', {
                    position: 'top-center',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                });
                coverImageUrl = await uploadImageToServer(coverImageFile, 'cover');
            }
            const updatedProfile = await axios.patch(BASE_URL + '/profile/edit',
                {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    about: formData.about,
                    dateOfBirth: formData.dateOfBirth,
                    mobileNumber: formData.mobileNumber,
                    location: formData.location,
                    interests: formData.interests,
                    profileImage: profileImageUrl,
                    coverImage: coverImageUrl,
                    gender: formData.gender
                }, { withCredentials: true });
            dispatch(addUser(updatedProfile?.data?.data));
            setProfileImageFile(null);
            setCoverImageFile(null);
            setTimeout(() => {
                navigate('/profile');
                toast.success('Profile Updated Successfully 🎉', {
                    position: 'top-center',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                });
            }, 2500);
        } catch (error) {
            toast.error('Something went wrong !!! 🫨', {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
            });
            setTimeout(() => {
                setIsSaveLoding(false);
            }, 3000)
            console.log(error);
        }
    }

    const sections = [
        { id: 'basic', label: 'Basic Info', icon: User },
        { id: 'contact', label: 'Contact', icon: Mail },
        { id: 'personal', label: 'Personal', icon: Heart },
    ]

    return (
        <div className='relative z-10 w-full px-3 sm:px-4 lg:px-6 max-w-5xl mx-auto pb-6'>
            <div className='bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl mb-4 sm:mb-6 lg:mb-8 p-4 sm:p-6 lg:p-8 overflow-hidden mt-4 sm:mt-6 lg:mt-10'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6'>
                    <div className='text-center md:text-left flex-1'>
                        <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2'>
                            Edit Profile
                        </h1>
                        <p className='text-sm sm:text-base text-gray-600'>Update your information and preferences</p>
                    </div>

                    <div className='flex flex-col xs:flex-row gap-2 sm:gap-4 md:flex-shrink-0'>
                        <button
                            className='flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base'
                            onClick={() => navigate('/profile')}
                        >
                            <X className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaveLoading || isFormUnchanged()}
                            className='flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap'
                        >
                            {isSaveLoading ? (
                                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Save className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                            )}
                            {isSaveLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-10'>
                <div className='lg:col-span-1'>
                    <div className='bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl p-3 sm:p-4 lg:p-6 lg:sticky lg:top-6'>
                        <nav className='flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible scrollbar-hide justify-center lg:justify-start'>
                            {sections.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        className={`flex items-center justify-center gap-2 sm:gap-3 py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-medium transition-all duration-300 cursor-pointer whitespace-nowrap text-sm sm:text-base ${activeSection === section.id
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                            : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                                            }`}
                                        onClick={() => setActiveSection(section.id)}
                                    >
                                        <Icon className='w-4 h-4 sm:w-5 sm:h-5' />
                                        <span>{section.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                <div className='lg:col-span-3'>
                    <div className='bg-white bg-opacity-95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8'>
                        {activeSection === 'basic' && (
                            <div className='space-y-6 sm:space-y-8'>
                                <h3 className='text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6'>Basic Information</h3>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                                    <div>
                                        <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-2'>First Name</label>
                                        <input
                                            type='text'
                                            value={formData?.firstName}
                                            className='w-full px-3 sm:px-4 py-2 sm:py-3 border-2 text-black border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base'
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-2'>Last Name</label>
                                        <input
                                            type='text'
                                            value={formData?.lastName}
                                            className='w-full px-3 sm:px-4 py-2 sm:py-3 border-2 text-black border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base'
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-2'>Gender</label>
                                        <div className='relative'>
                                            <User className='absolute left-3 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none' />
                                            <select
                                                value={formData?.gender}
                                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                                className='w-full pl-10 sm:pl-12 pr-8 sm:pr-10 py-2 sm:py-3 border-2 text-black border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer text-sm sm:text-base'
                                            >
                                                <option value=''>Select Gender</option>
                                                <option value='Male'>Male</option>
                                                <option value='Female'>Female</option>
                                                <option value='Other'>Other</option>
                                            </select>
                                            <ChevronDown className='absolute right-3 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none' />
                                        </div>
                                    </div>
                                    <div>
                                        <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-2'>Birth Date</label>
                                        <div className='relative'>
                                            <input
                                                type='date'
                                                value={formatDateForInput(formData?.dateOfBirth)}
                                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                                className='w-full px-3 sm:px-4 py-2 sm:py-3 border-2 text-black border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base'
                                                style={{ colorScheme: 'light' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-4 sm:mt-6'>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">About</label>
                                    <textarea
                                        value={formData?.about}
                                        onChange={(e) => handleInputChange('about', e.target.value)}
                                        rows={4}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 text-black border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white resize-none text-sm sm:text-base"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                            </div>
                        )}

                        {activeSection === 'contact' && (
                            <div className="space-y-4 sm:space-y-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Contact Information</h2>

                                <div className="p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg sm:rounded-xl overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-orange-100 opacity-30"></div>
                                    <div className="relative z-10">
                                        <p className="text-yellow-800 font-medium flex items-start gap-2 text-xs sm:text-sm">
                                            <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full animate-pulse mt-1 flex-shrink-0"></span>
                                            <span>Note: Email Id and Username are not editable.</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                value={formData?.email}
                                                disabled
                                                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border-2 text-gray-400 border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-gray-50 text-sm sm:text-base"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Username</label>
                                        <div className="relative">
                                            <AtSign className="absolute left-3 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                disabled
                                                value={formData?.userName}
                                                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border-2 text-gray-400 border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-gray-50 text-sm sm:text-base"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={formData?.mobileNumber}
                                                onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                                                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border-2 text-black border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData?.location}
                                                onChange={(e) => handleInputChange('location', e.target.value)}
                                                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border-2 text-black border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'personal' && (
                            <div className="space-y-6 sm:space-y-8">
                                <h2 className='text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6'>Cover Image</h2>

                                <div className='relative mb-6 sm:mb-8'>
                                    <div className='relative h-32 sm:h-40 md:h-48 bg-gray-200 rounded-xl sm:rounded-2xl overflow-hidden group'>
                                        <img
                                            src={coverImage}
                                            alt='Cover Image'
                                            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                                        />
                                        <div className='absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center'>
                                            <button
                                                onClick={() => coverFileRef.current?.click()}
                                                className='opacity-0 group-hover:opacity-100 flex items-center gap-2 px-3 sm:px-4 py-2 bg-white text-gray-800 rounded-full font-medium transition-all duration-300 hover:bg-gray-100 text-xs sm:text-sm'
                                            >
                                                <Camera className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                                                Change Cover
                                            </button>
                                        </div>
                                        <input
                                            ref={coverFileRef}
                                            type='file'
                                            accept='image/*'
                                            className='hidden'
                                            onChange={(e) => handleImageUpload('cover', e)}
                                        />
                                    </div>
                                </div>

                                <div className='flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8'>
                                    <div className='relative group'>
                                        <img
                                            src={profileImage}
                                            alt='Profile Image'
                                            className='w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-xl transition-transform duration-300 group-hover:scale-105'
                                        />
                                        <button
                                            onClick={() => profileFileRef.current?.click()}
                                            className='absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center rounded-full'
                                        >
                                            <Camera className='w-5 h-5 sm:w-6 sm:h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                                        </button>
                                        <input
                                            ref={profileFileRef}
                                            type='file'
                                            accept='image/*'
                                            className='hidden'
                                            onChange={(e) => handleImageUpload('profile', e)}
                                        />
                                    </div>
                                    <div className='text-center sm:text-left'>
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Profile Picture</h3>
                                        <p className="text-gray-600 text-xs sm:text-sm">JPG, PNG or GIF. Max size 10MB</p>
                                        <button
                                            onClick={() => profileFileRef.current?.click()}
                                            className="mt-2 flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-50 text-purple-600 rounded-lg font-medium hover:bg-purple-100 transition-colors duration-200 text-xs sm:text-sm mx-auto sm:mx-0"
                                        >
                                            <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            Upload New
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4 sm:space-y-6">
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Personal Interests</h2>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Interests & Hobbies</label>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {formData.interests.map((interest, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs sm:text-sm font-medium"
                                                >
                                                    {interest}
                                                    <button
                                                        onClick={() => handleRemoveInterest(interest)}
                                                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center rounded-full hover:bg-purple-200 transition-colors duration-200"
                                                    >
                                                        <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newInterest}
                                                onChange={(e) => setNewInterest(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                                                placeholder="Add new interest..."
                                                className="flex-1 px-4 py-2 border-2 text-black border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white"
                                            />
                                            <button
                                                onClick={handleAddInterest}
                                                disabled={!newInterest.trim()}
                                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-600 disabled:hover:to-pink-600"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfile;