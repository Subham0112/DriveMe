import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import { CaptainDataContext } from '../context/CaptainContext';

const API_BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const CaptainRideHistory = () => {
  const { captain } = useContext(CaptainDataContext);

  const [rides, setRides] = useState([]);
  const [stats, setStats] = useState({
    totalRides: 0,
    totalEarned: 0,
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/rides/captain-history/${captain?._id}`,
          { credentials: 'include' }
        );
        const data = await res.json();

        if (data.success) {
          setRides(data.rides);
          setStats({
            totalRides: data.totalRides,
            totalEarned: data.totalEarned,
          });
        }
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    };

    if (captain?._id) fetchHistory();
  }, [captain]);

  return (
    <div className='h-screen w-screen relative overflow-hidden bg-gray-50'>
      <Navbar userType="captain" />

      <div className='h-screen md:ml-64 pb-16 md:pb-0 overflow-y-auto'>
        <div className="p-4 md:p-6 max-w-4xl mx-auto">

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold mb-5 text-gray-800">
            Ride History
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">

            <div className="bg-white rounded-lg shadow-sm p-3">
              <p className="text-gray-500 text-xs">Completed Rides</p>
              <p className="text-xl font-bold text-gray-800">
                {stats.totalRides}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-3">
              <p className="text-gray-500 text-xs">Total Earnings</p>
              <p className="text-xl font-bold text-green-600">
                Rs.{stats.totalEarned}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-3 hidden md:block">
              <p className="text-gray-500 text-xs">Status</p>
              <p className="text-xl font-bold text-blue-500">
                Active
              </p>
            </div>

          </div>

          {/* Ride List */}
          <div className="space-y-3">

            {rides.length === 0 && (
              <p className="text-gray-500 text-center mt-10">
                No rides found
              </p>
            )}

            {rides.map((ride) => (
              <div
                key={ride._id}
                className="bg-white rounded-lg shadow-sm p-3 border border-gray-200"
              >

                {/* Top Row */}
                <div className="flex justify-between items-start">

                  <div>
                    {/* Passenger */}
                    <p className="font-semibold text-sm text-blue-600">
                      👤 {ride.user?.fullname?.firstname} {ride.user?.fullname?.lastname}
                    </p>

                    {/* Ride ID */}
                    <p className="text-[11px] text-gray-400">
                      Ride ID: {ride._id.slice(-6)}
                    </p>

                    {/* Date */}
                    <p className="text-[11px] text-gray-400">
                      {new Date(ride.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Status */}
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                      ride.rideStatus === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : ride.rideStatus === 'cancelled'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    {ride.rideStatus}
                  </span>

                </div>

                {/* Locations */}
                <div className="mt-2 space-y-1 text-xs">

                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 mr-2"></div>
                    <p className="text-gray-700">{ride.pickup.address}</p>
                  </div>

                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1 mr-2"></div>
                    <p className="text-gray-700">{ride.drop.address}</p>
                  </div>

                </div>

                {/* Bottom Row */}
                <div className="mt-2 pt-2 border-t flex justify-between items-center text-xs">
                  <span className="text-gray-500">Fare</span>
                  <span className="font-semibold text-green-600">
                    Rs.{ride.fare}
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

export default CaptainRideHistory;