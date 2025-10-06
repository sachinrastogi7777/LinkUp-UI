import React from 'react'
import logo from '../assets/linkup-logo.png'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { removeUser } from '../utils/slice/userSlice';
import { removeConnection } from '../utils/slice/connectionSlice';

const NavBar = () => {
    const userData = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogOut = async () => {
        try {
            await axios.post(BASE_URL + '/logout', {}, { withCredentials: true });
            dispatch(removeUser());
            dispatch(removeConnection());
            navigate('/login');
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="navbar bg-gradient-to-bl from-gray-900 via-purple-900 to-pink-900 shadow-sm px-4">
            <div className="h-12 w-24 flex items-center gap-2">
                <Link to='/'>
                    <img
                        src={logo}
                        alt="LinkUp Logo"
                        className="h-12 w-24"
                    />
                </Link>
            </div>
            {userData &&
                <div className="flex gap-2 items-center ml-auto">
                    <button className="btn btn-primary">{`Requests ()`}</button>
                    <p className='flex items-center px-2.5'>{`Welcome, ${userData.firstName}`}</p>
                    <div className="dropdown dropdown-end mx-5">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="user-profile-pic"
                                    src={userData.profileImage}
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                        >
                            <li>
                                <Link to='/profile' className="justify-between">
                                    Profile
                                    <span className="badge">New</span>
                                </Link>
                            </li>
                            <li><a>Settings</a></li>
                            <li onClick={handleLogOut}><Link>Logout</Link></li>
                        </ul>
                    </div>
                </div>
            }
        </div>
    )
}

export default NavBar;