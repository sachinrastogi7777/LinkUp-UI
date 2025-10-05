import React from 'react'
import NavBar from './NavBar'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Footer from './Footer'

const Body = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
            <NavBar />
            <main className='flex-grow'>
                <Outlet />
            </main>
            <Footer />
            <ToastContainer />
        </div>
    )
}

export default Body