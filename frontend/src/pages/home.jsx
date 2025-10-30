import React from 'react'
import { Link } from 'react-router-dom'
import driveMeLogo from '../assets/img/DriveMe-Logo.png'




const home = () => {


  return (
    <div className='home-page h-screen w-full   flex flex-col justify-between'>
      <img  src={driveMeLogo} className=' w-28 ml-5' />
    <div className=' px-10 py-10 flex flex-col bg-cyan-900 text-white '>
      <h2 className='text-2xl font-bold text-center'>Get started with DriveMe</h2>
      <Link to="/login" className='flex justify-center item-center bg-cyan-400 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded mt-2 '>Continue</Link>
    </div>
     </div>
  )
}

export default home
