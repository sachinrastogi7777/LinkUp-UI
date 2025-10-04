import React from 'react'
import logo from '../assets/linkup-logo.png'
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <div className="navbar bg-base-300 shadow-sm px-4">
            <div className="flex-1 items-center gap-2">
                <Link to='/'>
                    <img
                        src={logo}
                        alt="LinkUp Logo"
                        className="h-12 w-24"
                    />
                </Link>
            </div>
            <div className="flex gap-2 items-center">
                <button className="btn btn-primary">{`Requests ()`}</button>
                <div className="dropdown dropdown-end mx-5">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="User avatar"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                    >
                        <li>
                            <a className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <li><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default NavBar;