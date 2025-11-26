import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser } from '../../utils/slice/userSlice';
import { addRequests } from '../../utils/slice/requestSlice';
import { addSentRequests } from '../../utils/slice/sentRequestSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleCallback = async () => {
            const success = searchParams.get('success');
            const error = searchParams.get('error');
            const isNewUser = searchParams.get('newUser') === 'true';

            if (error) {
                let errorMessage = 'Authentication failed. Please try again.';
                if (error === 'google_auth_failed') {
                    errorMessage = 'Google authentication failed. Please try again.';
                } else if (error === 'token_generation_failed') {
                    errorMessage = 'Failed to generate session. Please try again.';
                }

                toast.error(errorMessage, {
                    position: 'top-center',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                });
                navigate('/login');
                return;
            }

            if (success === 'true') {
                try {
                    const profileResponse = await axios.get(`${BASE_URL}/profile/view`, {
                        withCredentials: true
                    });

                    if (profileResponse.data) {
                        dispatch(addUser(profileResponse.data));
                        try {
                            const receivedRequestsData = await axios.get(`${BASE_URL}/user/requests/received`, {
                                withCredentials: true
                            });
                            dispatch(addRequests(receivedRequestsData?.data?.data));
                        } catch (err) {
                            console.log('Failed to fetch received requests:', err);
                        }

                        try {
                            const sentRequestsData = await axios.get(`${BASE_URL}/user/requests/sent`, {
                                withCredentials: true
                            });
                            dispatch(addSentRequests(sentRequestsData?.data?.data));
                        } catch (err) {
                            console.log('Failed to fetch sent requests:', err);
                        }

                        if (isNewUser) {
                            toast.success('Welcome to LinkUp! 🎉 Please complete your profile.', {
                                position: 'top-center',
                                autoClose: 2500,
                                hideProgressBar: false,
                                closeOnClick: false,
                                pauseOnHover: false,
                                draggable: false,
                            });
                            navigate('/profile/edit');
                        } else {
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
                    } else {
                        throw new Error('Failed to fetch user profile');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    toast.error('Failed to load user data. Please try logging in again.', {
                        position: 'top-center',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: false,
                        draggable: false,
                    });
                    navigate('/login');
                }
            } else {
                navigate('/login');
            }
        };

        handleCallback();
    }, [searchParams, navigate, dispatch]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
            <div className="bg-white bg-opacity-95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center">
                <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    Authenticating...
                </h2>
                <p className="text-gray-600">Please wait while we log you in</p>
            </div>
        </div>
    );
};

export default AuthCallback;