import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import Footer from './Footer'
import { addUser } from '../utils/slice/userSlice'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'

const Body = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const userData = useSelector((store) => store.user);
    const receivedRequestsList = useSelector((store) => store.request);
    const sentRequestsList = useSelector((store) => store.sentRequest);
    const [receivedRequestsLength, setReceivedRequestsLength] = useState(receivedRequestsList?.length || 0);
    const [sentRequestsLength, setSentRequestsLength] = useState(sentRequestsList?.length || 0);

    useEffect(() => {
        setReceivedRequestsLength(receivedRequestsList?.length || 0);
    }, [receivedRequestsList]);

    useEffect(() => {
        setSentRequestsLength(sentRequestsList?.length || 0);
    }, [sentRequestsList]);

    useEffect(() => {
    const publicRoutes = ['/login', '/signup', '/forgot-password'];
        const isPublicRoute = publicRoutes.includes(location.pathname);

        if (isPublicRoute || userData) {
            return;
        }
        const fetchUser = async () => {
            try {
                const res = await axios.get(BASE_URL + '/profile/view', { withCredentials: true });
                dispatch(addUser(res.data));
            }
            catch (error) {
                if (error.status === 401) {
                    const manualLogout = localStorage.getItem('manualLogout');
                    if (!manualLogout) {
                        toast.error('Session expired. Please log in again.', {
                            position: 'top-center',
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: false,
                            progress: undefined,
                        });
                    }
                    localStorage.removeItem('manualLogout');
                    navigate('/login');
                }
            }
        };
        fetchUser();
    }, [dispatch, navigate, location.pathname, userData])
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
            <NavBar
                totalRequests={receivedRequestsLength + sentRequestsLength}
            />
            <main className='flex-grow'>
                <Outlet />
            </main>
            <Footer />
            <ToastContainer />
        </div>
    )
}

export default Body;