import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoMdHome, IoMdTime, IoMdPerson, IoMdLogOut } from 'react-icons/io';
import DriveMeLogo from '../assets/img/DriveMe-logo.png';

const Navbar = ({ userType = 'user' }) => {
  const location = useLocation();
  const logoutPath = userType === 'user' ? '/user/logout' : '/captain/logout';

  const navItems = [
    { path: userType === 'user' ? '/main' : '/captainmain', icon: IoMdHome, label: `${userType.charAt(0).toUpperCase() + userType.slice(1)} Home` },
    { path: `/${userType}/ride-history`, icon: IoMdTime, label: 'Ride History' },
    { path: `/${userType}/profile`, icon: IoMdPerson, label: 'Profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Sidebar for larger screens */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 md:bg-gradient-to-b md:from-blue-600 md:to-indigo-600 md:z-50">
        {/* Logo */}
        <div className="flex items-center justify-center h-20 px-4 bg-white/10">
          <img src={DriveMeLogo} alt="DriveMe Logo" className="h-12 w-24 object-contain" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <item.icon className="w-6 h-6 mr-3" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout button */}
        <div className="px-4 py-6">
          <Link
            to={logoutPath}
            className="flex items-center px-4 py-3 rounded-lg text-white hover:bg-red-500 transition-all duration-200"
          >
            <IoMdLogOut className="w-6 h-6 mr-3" />
            <span className="font-medium">Logout</span>
          </Link>
        </div>
      </div>

      {/* Mobile bottom navbar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[5000] shadow-lg">
        <nav className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200 ${
                isActive(item.path)
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive(item.path) ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          ))}
          <Link
            to={logoutPath}
            className="flex flex-col items-center justify-center flex-1 h-full text-gray-500 hover:text-red-500 transition-colors duration-200"
          >
            <IoMdLogOut className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Logout</span>
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Navbar;