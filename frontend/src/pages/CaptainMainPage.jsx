import React, { useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import DriveMeLogo from '../assets/img/DriveMe-Logo.png';
import MapSample from '../assets/img/map_sample.gif';
import { IoIosArrowDown, IoIosPin } from "react-icons/io";
import RideRequest from '../components/captainComponents/RideRequest';
import gsap from 'gsap';

const CaptainMainPage = () => {
const [rideRequestPanelOpen, setRideRequestPanelOpen] = useState(false);
const rideReqRef =useRef(null);
const arrowRef = useRef(null);

const handleRideRequestPanelToggle = () => {
  if (!rideRequestPanelOpen) {
    gsap.to(rideReqRef.current, {
      duration: 0.7,
      height: "70%",
      ease: 'power2.out',
    });
    gsap.to(arrowRef.current, {
      duration: 0.7,
      opacity: 1,
      ease: 'power2.out',
    
    });
    setRideRequestPanelOpen(true);
  }else{
    gsap.to(rideReqRef.current, {
      duration: 0.5,
      height: 0,
      ease: 'power2.out',
    });
    gsap.to(arrowRef.current, {
      duration: 0.3,
      opacity: 0,
      ease: 'power2.in',
    });
    setRideRequestPanelOpen(false);
  }
}

  return (
    <div className='h-screen w-screen relative overflow-hidden'>
      <Navbar userType="captain" />
      
      {/* Main content area - adjusted for Navbar */}
      <div className='h-screen w-screen md:ml-64 pb-16 md:pb-0'>
        {/* Logo - only visible on mobile */}
        <img src={DriveMeLogo} alt="DriveMe Logo" className="w-24 h-12 absolute left-5 top-5 md:hidden" />
          <div className='h-screen w-full'>
                  <img src={MapSample} alt="Map Sample" className="w-full h-full object-cover" />
                </div>

          <div className='flex flex-col justify-end h-screen absolute top-0 w-full md:w-[calc(100vw-16rem)] pb-16 md:pb-0 overflow-auto'>
                  <div className='px-8 py-4 h-[30%] bg-white flex gap-8 relative z-[2000] w-full md:w-[75%] md:mx-auto md:rounded-t-2xl md:shadow-xl'>
                 <IoIosArrowDown ref={arrowRef}  className='text-3xl opacity-0 absolute top-2 right-5 text-gray-500 cursor-pointer z-20' />
                  {/* Earnings Section - 60% width */}
                  <div className='flex-[1.5]'>
                    <h3 className='text-gray-700 font-semibold text-base mb-3'>Today's Earnings</h3>
                    <div className='flex gap-6 items-center'>
                      <div>
                        <p className='text-sm text-gray-600 mb-1'>Total Earned</p>
                        <p className='text-3xl font-bold text-green-600'>$100</p>
                      </div>
                      <div className='w-px h-16 bg-gray-200'></div>
                      <div>
                        <p className='text-sm text-gray-600 mb-1'>Rides Completed</p>
                        <p className='text-3xl font-bold text-blue-600'>5</p>
                      </div>
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className='w-px bg-gray-300'></div>
                  
                  {/* Ride Request Section - 40% width */}
                  <div className='flex-1 flex flex-col justify-center'>
                    <h4 className='text-gray-700 font-semibold text-base mb-3'>Available Ride Request: <span className='font-bold text-indigo-500'>3</span></h4>
                    <button onClick={handleRideRequestPanelToggle} className='bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-lg text-base font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105'>
                      {rideRequestPanelOpen ? "Hide Ride Requests" : "Show Ride Requests"}
                    </button>
                  </div>
                  
                  </div>
                  <div ref={rideReqRef} className='h-[0%] bg-white z-[2000] overflow-auto w-full md:w-[75%] md:mx-auto  md:shadow-xl '>
                  <RideRequest />
                  </div>
                </div>
      </div>
    </div>
  );
};

export default CaptainMainPage;