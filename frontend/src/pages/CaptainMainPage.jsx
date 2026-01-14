import React from 'react';
import Navbar from '../components/Navbar';
import DriveMeLogo from '../assets/img/DriveMe-Logo.png';
import MapSample from '../assets/img/map_sample.gif';
import RideRequest from '../components/captainComponents/RideRequest';

const CaptainMainPage = () => {
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
                  <RideRequest />

                </div>
      </div>
    </div>
  );
};

export default CaptainMainPage;