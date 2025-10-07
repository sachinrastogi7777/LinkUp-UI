import axios from 'axios';
import { AtSign, Calendar, Camera, ChevronDown, Heart, Mail, MapPin, Phone, Save, Upload, User, X } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react'
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
    // Sync form state with Redux user data on load/refresh
    useEffect(() => {
        // Only update if formData is empty or matches initial userData (not after user edits)
        if (!formData || Object.keys(formData).length === 0 || formData === userData) {
            setFormData(userData);
            setCoverImage(userData?.coverImage || null);
            setProfileImage(userData?.profileImage || null);
        }
    }, [userData]);
    const [isSaveLoading, setIsSaveLoding] = useState(false);
    const [activeSection, setActiveSection] = useState('basic');
    const [coverImage, setCoverImage] = useState(userData?.coverImage || null);
    const [profileImage, setProfileImage] = useState(userData?.profileImage || null);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [newInterest, setNewInterest] = useState('');

    const coverFileRef = useRef(null);
    const profileFileRef = useRef(null);

    const formatDateForInput = (date) => {
        if (!date) return '';
        if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) return date; // already in YYYY-MM-DD format
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
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                toast.error('File size should be less than 10MB.', {
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
        // Compare all relevant fields (shallow for primitives/arrays)
        if (!userData) return false;
        const fields = [
            'firstName', 'lastName', 'about', 'dateOfBirth', 'mobileNumber', 'location', 'gender'
        ];
        for (const field of fields) {
            if (formData[field] !== userData[field]) return false;
        }
        // Compare interests array
        if (Array.isArray(formData.interests) && Array.isArray(userData.interests)) {
            if (formData.interests.length !== userData.interests.length ||
                formData.interests.some((v, i) => v !== userData.interests[i])) {
                return false;
            }
        } else if (formData.interests !== userData.interests) {
            return false;
        }
        // Compare images
        if (profileImage !== userData.profileImage) return false;
        if (coverImage !== userData.coverImage) return false;
        // No new files selected
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
            // Only upload if a new file is selected
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
        <div className='relative z-10 max-w-5xl mx-auto'>
            <div className='bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl shadow-2xl mb-8 p-6 md:p-8 overflow-hidden mt-10'>
                <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
                    <div>
                        <h1 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2'>
                            Edit Profile
                        </h1>
                        <p className='text-gray-600'>Update your information and preferences</p>
                    </div>
                    <div className='flex gap-4'>
                        <button className='flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105' onClick={() => navigate('/profile')}>
                            <X className='w-4 h-4' />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaveLoading}
                            className='flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none'
                        >
                            {isSaveLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Save className='w-4 h-4' />
                            )}
                            {isSaveLoading ? 'Saving...' : 'Save Changes'}                        </button>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-10'>
                <div className='lg:col-span-1'>
                    <div className='bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl shadow-xl p-6 space-y-4 sticky top-6'>
                        <nav className='space-y-2'>
                            {sections.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl font-medium transition-all duration-300 cursor-pointer ${activeSection === section.id
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                                            : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                                            }`}
                                        onClick={() => setActiveSection(section.id)}
                                    >
                                        <Icon className='w-5 h-5' />
                                        {section.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                <div className='lg:col-span-3'>
                    <div className='bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl shadow-xl p-6 md:p-8'>
                        {activeSection === 'basic' && (
                            <div className='space-y-8'>
                                <h3 className='text-xl font-semibold text-gray-800 mb-6'>Basic Information</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>First Name</label>
                                        <input
                                            type='text'
                                            value={formData?.firstName}
                                            className='w-full px-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white'
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Last Name</label>
                                        <input
                                            type='text'
                                            value={formData?.lastName}
                                            className='w-full px-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white'
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Gender</label>
                                        <div className='relative'>
                                            <User className='absolute left-3 top-4 w-5 h-5 text-gray-400 pointer-events-none' />
                                            <select
                                                value={formData?.gender}
                                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                                className='w-full pl-12 pr-10 py-3 border-2 text-black border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer'
                                            >
                                                <option value=''>Select Gender</option>
                                                <option value='Male'>Male</option>
                                                <option value='Female'>Female</option>
                                                <option value='Other'>Other</option>
                                            </select>
                                            <ChevronDown className='absolute right-3 top-4 w-5 h-5 text-gray-400 pointer-events-none' />
                                        </div>
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Birth Date</label>
                                        <div className='relative'>
                                            <input
                                                type='date'
                                                value={formatDateForInput(formData?.dateOfBirth)}
                                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                                className='w-full px-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white'
                                                style={{ colorScheme: 'light' }} // Ensures consistent date picker styling
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-6'>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
                                    <textarea
                                        value={formData?.about}
                                        onChange={(e) => handleInputChange('about', e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                            </div>
                        )}

                        {activeSection === 'contact' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">Contact Information</h2>
                                <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-xl overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-orange-100 opacity-30"></div>
                                    <div className="relative z-10">
                                        <p className="text-yellow-800 font-medium flex items-center gap-3">
                                            <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                                            <span className="inline-block animate-bounce-horizontal">
                                                Note :- Email Id and Username are not editable.
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-4 w-5 h-5 text-gray-400 my-1" />
                                            <input
                                                type="email"
                                                value={formData?.email}
                                                disabled
                                                className="w-full pl-12 pr-12 py-3 border-2 text-gray-400 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white group/email-disabled"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                                        <div className="relative">
                                            <AtSign className="absolute left-3 top-4 w-5 h-5 text-gray-400 my-1" />
                                            <input
                                                type="text"
                                                disabled
                                                value={formData?.userName}
                                                className="w-full pl-12 pr-4 py-3 border-2 text-gray-400 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                                        <div className="relative align-middle">
                                            <Phone className="absolute left-3 top-4 w-5 h-5 text-gray-400 my-1" />
                                            <input
                                                type="tel"
                                                value={formData?.mobileNumber}
                                                onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-4 w-5 h-5 text-gray-400 my-1" />
                                            <input
                                                type="text"
                                                value={formData?.location}
                                                onChange={(e) => handleInputChange('location', e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'personal' && (
                            <div>
                                <h2 className='text-xl font-semibold text-gray-800 mb-6'>Profile Image</h2>
                                <div className='relative mb-8'>
                                    <div className='relative h-48 bg-gyay-200 rounded-2xl overflow-hidden group'>
                                        <img
                                            src={coverImage}
                                            alt='Cover Image'
                                            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                                        />
                                        <div className='absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center'>
                                            <button
                                                onClick={() => coverFileRef.current?.click()}
                                                className='opacity-0 group-hover:opacity-100 flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded-full font-medium transition-all duration-300 hover:bg-gray-100'
                                            >
                                                <Camera className='w-4 h-4' />
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

                                <div className='flex items-center gap-6 mb-8'>
                                    <div className='relative group'>
                                        <img
                                            src={profileImage}
                                            alt='Profile Image'
                                            className='w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl transition-transform duration-300 group-hover:scale-105'
                                        />
                                        <button
                                            onClick={() => profileFileRef.current?.click()}
                                            className='absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center rounded-full'
                                        >
                                            <Camera className='w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                                        </button>
                                        <input
                                            ref={profileFileRef}
                                            type='file'
                                            accept='image/*'
                                            className='hidden'
                                            onChange={(e) => handleImageUpload('profile', e)}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">Profile Picture</h3>
                                        <p className="text-gray-600 text-sm">JPG, PNG or GIF. Max size 10MB</p>
                                        <button
                                            onClick={() => profileFileRef.current?.click()}
                                            className="mt-2 flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg font-medium hover:bg-purple-100 transition-colors duration-200"
                                        >
                                            <Upload className="w-4 h-4" />
                                            Upload New
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Interests</h2>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Interests & Hobbies</label>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {formData.interests.map((interest, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium"
                                                >
                                                    {interest}
                                                    <button
                                                        onClick={() => handleRemoveInterest(interest)}
                                                        className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-purple-200 transition-colors duration-200"
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
                                                onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                                                placeholder="Add new interest..."
                                                className="flex-1 px-4 py-2 border-2 text-black border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white"
                                            />
                                            <button
                                                onClick={handleAddInterest}
                                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
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

export default EditProfile