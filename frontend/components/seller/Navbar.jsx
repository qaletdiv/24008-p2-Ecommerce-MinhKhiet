import React from 'react'
import { assets } from '../../../backend/assets/assets'
import Image from 'next/image'
import '../../styles/SellerNavbar.css';
import { useAppContext } from '../../context/AppContext';

const Navbar = () => {

  const { router } = useAppContext()

  return (
    <div className='seller-navbar-container'>
      <Image onClick={()=>router.push('/')} className='seller-navbar-logo' src={assets.logo} alt="logo" width={120} height={40} />
      <button className='seller-navbar-logout-btn'>Logout</button>
    </div>
  )
}

export default Navbar