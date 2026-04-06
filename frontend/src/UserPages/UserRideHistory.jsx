import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';

const UserRideHistory = () => {

  const { user } = useContext(UserDataContext);
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/user-history/${user._id}`
        );

        setRides(res.data.rides);

      } catch (err) {
        console.log(err);
      }
    };

    if (user?._id) fetchHistory();
  }, [user]);

  return (
    <div className='h-screen w-screen relative overflow-hidden bg-gray-50'>
      <Navbar userType="user" />
      
      <div className='h-screen md:ml-64 pb-16 md:pb-0 overflow-y-auto'>
        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Ride History</h1>
          
          <div className="space-y-4">

            {rides.length === 0 && (
              <p className="text-gray-500">No rides yet</p>
            )}

            {rides.map((ride) => (
              <div key={ride._id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-lg">
                      {ride.captain?.fullname?.firstname} {ride.captain?.fullname?.lastname}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {new Date(ride.createdAt).toDateString()}
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${ride.rideStatus === 'completed' ? 'bg-green-100 text-green-800' :
                      ride.rideStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'}`}>
                    {ride.rideStatus}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                    <p className="text-gray-700"><b>From: </b>{ride.pickup.address}</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 mr-3"></div>
                    <p className="text-gray-700"><b>To: </b>{ride.drop.address}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                  <span className="text-gray-600">Fare</span>
                  <span className="font-semibold text-gray-800">
                    ${ride.fare}
                  </span>
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