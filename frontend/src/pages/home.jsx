import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='home-page h-screen w-full flex flex-col'>
      {/* Mobile/Tablet View (original design) - hidden on 800px+ screens */}
      <div className='hidden-800+ h-screen w-full flex flex-col justify-between bg-cover bg-center' 
           style={{backgroundImage: 'url(../assets/img/main-image.jpg)'}}>
        <div className='p-5'>
          <div className='text-3xl font-bold text-blue-900'>DriveMe</div>
        </div>
        <div className='px-10 py-10 flex flex-col bg-cyan-900 text-white'>
          <h2 className='text-2xl font-bold text-center'>Get started with DriveMe</h2>
          <Link  className='flex justify-center items-center bg-cyan-400 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded mt-2 transition-colors' to='/home'>
            Continue
          </Link>
        </div>
      </div>

      {/* Desktop View (professional design) - visible only on 800px+ screens */}
      <div className='visible-800+ h-screen w-full flex-row'>
        {/* Left Section - Hero */}
        <div className='w-1/2 bg-gradient-to-br from-cyan-800 to-cyan-950 flex flex-col justify-between p-12 text-white relative overflow-hidden'>
          {/* Background Pattern */}
          <div className='absolute inset-0 opacity-10'>
            <div className='absolute top-20 left-20 w-64 h-64 bg-cyan-400 rounded-full blur-3xl'></div>
            <div className='absolute bottom-20 right-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl'></div>
          </div>
          
          {/* Logo */}
          <div className='relative z-10'>
            <div className='text-4xl font-bold mb-2'>DriveMe</div>
            <div className='text-cyan-300 text-lg'>Your journey, simplified</div>
          </div>

          {/* Features */}
          <div className='relative z-10 space-y-8 mb-12'>
            <div className='flex items-start space-x-4'>
              <div className='bg-cyan-400 rounded-lg p-3 mt-1'>
                <svg className='w-6 h-6 text-cyan-900' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 10V3L4 14h7v7l9-11h-7z' />
                </svg>
              </div>
              <div>
                <h3 className='text-xl font-semibold mb-1'>Quick & Easy Booking</h3>
                <p className='text-cyan-200'>Book your ride in seconds with our intuitive interface</p>
              </div>
            </div>

            <div className='flex items-start space-x-4'>
              <div className='bg-cyan-400 rounded-lg p-3 mt-1'>
                <svg className='w-6 h-6 text-cyan-900' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' />
                </svg>
              </div>
              <div>
                <h3 className='text-xl font-semibold mb-1'>Affordable Prices</h3>
                <p className='text-cyan-200'>Transparent pricing with no hidden charges</p>
              </div>
            </div>

            <div className='flex items-start space-x-4'>
              <div className='bg-cyan-400 rounded-lg p-3 mt-1'>
                <svg className='w-6 h-6 text-cyan-900' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                </svg>
              </div>
              <div>
                <h3 className='text-xl font-semibold mb-1'>Safe & Secure</h3>
                <p className='text-cyan-200'>Verified drivers and secure payment methods</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='relative z-10 text-cyan-300 text-sm'>
            © 2025 DriveMe. All rights reserved.
          </div>
        </div>

        {/* Right Section - Sign In */}
        <div className='w-1/2 bg-white flex items-center justify-center p-12'>
          <div className='max-w-md w-full'>
            {/* Traffic Light Image */}
            <div className='mb-8 rounded-2xl overflow-hidden shadow-2xl'>
              <img 
                src='https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800' 
                alt='Traffic Light' 
                className='w-full h-64 object-cover'
              />
            </div>

            {/* Welcome Text */}
            <div className='text-center mb-8'>
              <h1 className='text-3xl font-bold text-gray-800 mb-3'>
                Get started with DriveMe
              </h1>
              <p className='text-gray-600 text-lg'>
                Book your ride and reach your destination safely
              </p>
            </div>

            {/* CTA Button */}
            <Link to="/login" className='block w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-lg py-4 px-6 rounded-xl text-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'>
              Continue to Login
            </Link>

            {/* Additional Info */}
            <div className='mt-8 text-center'>
              <p className='text-gray-500 text-sm'>
                New to DriveMe?{' '}
                <Link to="/usersignup" className='text-cyan-600 hover:text-cyan-700 font-semibold'>
                  Create an account
                </Link>
              </p>
            </div>

            {/* Stats */}
            <div className='mt-12 grid grid-cols-3 gap-6 text-center'>
              <div>
                <div className='text-3xl font-bold text-cyan-600'>50K+</div>
                <div className='text-gray-600 text-sm mt-1'>Active Users</div>
              </div>
              <div>
                <div className='text-3xl font-bold text-cyan-600'>1M+</div>
                <div className='text-gray-600 text-sm mt-1'>Rides Completed</div>
              </div>
              <div>
                <div className='text-3xl font-bold text-cyan-600'>4.8★</div>
                <div className='text-gray-600 text-sm mt-1'>Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}

export default Home