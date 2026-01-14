import React from 'react'
import Navbar from '../components/Navbar';

const  CaptainProfile = () => {
  return (
    <div className='h-screen w-screen relative overflow-hidden bg-gray-50'>
      <Navbar userType="captain" />
      
      <div className='h-screen md:ml-64 pb-16 md:pb-0 overflow-y-auto'>
        <div className="p-6 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Captain Profile</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                JS
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-800">Jane Smith</h2>
                <p className="text-gray-500">jane.smith@example.com</p>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-500 mr-1">⭐</span>
                  <span className="text-gray-700 font-semibold">4.8</span>
                  <span className="text-gray-500 text-sm ml-1">(156 rides)</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <p className="text-gray-800">+1 234 567 8900</p>
              </div>
              
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                <p className="text-gray-800">Toyota Camry - ABC 1234</p>
              </div>
              
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Captain Since</label>
                <p className="text-gray-800">January 2024</p>
              </div>
              
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Earnings</label>
                <p className="text-green-600 font-semibold text-lg">$3,420.00</p>
              </div>
            </div>
            
            <button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainProfile;
