import React from 'react';
import Navbar from '../components/Navbar';

// User Ride History Page
const  UserRideHistory = () => {
  return (
    <div className='h-screen w-screen relative overflow-hidden bg-gray-50'>
      <Navbar userType="user" />
      
      <div className='h-screen md:ml-64 pb-16 md:pb-0 overflow-y-auto'>
        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Ride History</h1>
          
          <div className="space-y-4">
            {/* Sample ride history items */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-lg">Trip #{item}</p>
                    <p className="text-gray-500 text-sm">Dec {25 + item}, 2024</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Completed
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                    <p className="text-gray-700">Pickup Location {item}</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 mr-3"></div>
                    <p className="text-gray-700">Dropoff Location {item}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                  <span className="text-gray-600">Fare</span>
                  <span className="font-semibold text-gray-800">${(15 + item * 5).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRideHistory;

