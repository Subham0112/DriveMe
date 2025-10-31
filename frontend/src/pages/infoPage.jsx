import React from 'react'
import { Link } from 'react-router-dom'

const InfoPage = () => {
  return (
    <div className='info-page min-h-screen w-full bg-gradient-to-br from-cyan-800 to-cyan-950 flex flex-col'>
      {/* Header with Back Button and Logo */}
      <div className='p-6'>
        <Link to="/" className='inline-flex items-center text-cyan-300 hover:text-white mb-4 transition-colors'>
          <svg className='w-6 h-6 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10 19l-7-7m0 0l7-7m-7 7h18' />
          </svg>
          <span className='font-semibold '>Back</span>
        </Link>
        <div className='text-3xl font-bold text-white'>DriveMe</div>
        <div className='text-cyan-300 text-sm mt-1'>Your journey, simplified</div>
      </div>

      {/* Hero Image */}
      <div className='px-6 mb-6'>
        <div className='rounded-2xl overflow-hidden shadow-2xl'>
          <img 
            src='https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800' 
            alt='Traffic Light' 
            className='w-full h-auto object-contain'
          />
        </div>
      </div>

      {/* Welcome Section */}
      <div className='px-6 mb-8'>
        <h1 className='text-2xl font-bold text-white mb-3 text-center'>
          Get started with DriveMe
        </h1>
        <p className='text-cyan-200 text-center text-md'>
          Book your ride and reach your destination safely
        </p>
      </div>

      {/* Features Section */}
      <div className='px-6 space-y-6 mb-8'>
        <div className='bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-5 flex items-start space-x-4'>
          <div className='bg-cyan-400 rounded-lg p-3 mt-1 flex-shrink-0'>
            <svg className='w-6 h-6 text-cyan-900' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 10V3L4 14h7v7l9-11h-7z' />
            </svg>
          </div>
          <div>
            <h3 className='text-md font-semibold text-white mb-1'>Quick & Easy Booking</h3>
            <p className='text-cyan-200 text-sm'>Book your ride in seconds with our intuitive interface</p>
          </div>
        </div>

        <div className='bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-5 flex items-start space-x-4'>
          <div className='bg-cyan-400 rounded-lg p-3 mt-1 flex-shrink-0'>
            <svg className='w-6 h-6 text-cyan-900' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' />
            </svg>
          </div>
          <div>
            <h3 className='text-lg font-semibold text-white mb-1'>Affordable Prices</h3>
            <p className='text-cyan-200 text-sm'>Transparent pricing with no hidden charges</p>
          </div>
        </div>

        <div className='bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-5 flex items-start space-x-4'>
          <div className='bg-cyan-400 rounded-lg p-3 mt-1 flex-shrink-0'>
            <svg className='w-6 h-6 text-cyan-900' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
            </svg>
          </div>
          <div>
            <h3 className='text-lg font-semibold text-white mb-1'>Safe & Secure</h3>
            <p className='text-cyan-200 text-sm'>Verified drivers and secure payment methods</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className='px-6 mb-8'>
        <div className='bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6'>
          <div className='grid grid-cols-3 gap-4 text-center'>
            <div>
              <div className='text-2xl font-bold text-cyan-300'>50K+</div>
              <div className='text-cyan-100 text-xs mt-1'>Active Users</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-cyan-300'>1M+</div>
              <div className='text-cyan-100 text-xs mt-1'>Rides Completed</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-cyan-300'>4.8★</div>
              <div className='text-cyan-100 text-xs mt-1'>Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className='px-6 pb-8 mt-auto'>
        <Link 
          to="/login" 
          className='block w-full bg-cyan-400 hover:bg-cyan-500 text-cyan-900 font-bold text-md py-4 px-6 rounded-xl text-center transition-all duration-300 shadow-lg mb-4'
        >
          Continue to Login
        </Link>
        
        <div className='text-center'>
          <p className='text-cyan-200 text-sm'>
            New to DriveMe?{' '}
            <Link to="/usersignup" className='text-cyan-300 hover:text-white font-semibold underline'>
              Create an account
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className='text-center text-cyan-300 text-xs mt-6'>
          © 2025 DriveMe. All rights reserved.
        </div>
      </div>
    </div>
  )
}

export default InfoPage