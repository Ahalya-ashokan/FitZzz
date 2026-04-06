import React from 'react'
import Topbar from '../Layout/Topbar'
import Navbar from './Navbar'

const Header = () => {
  return (
    <div>
        <header className='border-b border-gray-200'>
        {/* Topbar */}
        <Topbar/>
        {/* Navbar */}
        <Navbar/>
        {/* Cart drawer */}
        </header>
    </div>
  )
}

export default Header