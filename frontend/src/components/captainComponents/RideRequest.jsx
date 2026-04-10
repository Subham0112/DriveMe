import React, { useEffect, useState, useContext } from 'react'
import { MapPin, Navigation, Clock } from 'lucide-react'
import socket from '../../socket/socket'
import { CaptainDataContext } from '../../context/CaptainContext'

const API_BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:5000'

const RideRequest = ({ onRideAccepted }) => {
  const [pendingRides, setPendingRides] = useState([])
  const { captain } = useContext(CaptainDataContext)

  
  useEffect(() => {
    const handleNewRide = (ride) => {
      setPendingRides((prev) => {
        // avoid duplicates
        if (prev.find((r) => r._id === ride._id)) return prev
        return [ride, ...prev]
      })
    }

    socket.on('new-ride-request', handleNewRide)
    return () => socket.off('new-ride-request', handleNewRide)
  }, [])

  const handleAccept = async (ride) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/rides/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rideId: ride._id, captainId: captain?._id }),
      })
      const data = await res.json()
      if (data.success) {
     
        setPendingRides((prev) => prev.filter((r) => r._id !== ride._id))
      
        onRideAccepted({ ride: data.ride || ride, captain: data.captain })
      } else {
        alert(data.message || 'Could not accept ride')
      }
    } catch (err) {
      console.error('Accept ride error:', err)
      alert('Network error')
    }
  }

  const handleReject = async (ride) => {
    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/rides/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rideId: ride._id }),
      })
      setPendingRides((prev) => prev.filter((r) => r._id !== ride._id))
    } catch (err) {
      console.error('Reject ride error:', err)
    }
  }

  return (
    <div className='w-full h-full bg-gray-50'>
      {/* Header */}
      <div className='bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-10'>
        <h3 className='text-lg font-bold text-gray-800'>Available Ride Requests</h3>
        <p className='text-xs text-gray-500 mt-0.5'>{pendingRides.length} passengers waiting</p>
      </div>

      {pendingRides.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-16 text-gray-400'>
          <div className='w-12 h-12 border-4 border-gray-200 border-t-indigo-400 rounded-full animate-spin mb-4'></div>
          <p className='text-sm'>Waiting for ride requests...</p>
        </div>
      ) : (
        <div className='p-3 space-y-2'>
          {pendingRides.map((ride) => (
            <div key={ride._id} className='bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden'>
              <div className='p-3'>
                {/* User info */}
                <div className='flex items-start justify-between mb-2'>
                  <div className='flex items-center gap-2.5'>
                    <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center'>
                      <span className='text-white font-bold text-base'>
                        {ride.user?.fullname?.firstname?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <h4 className='font-semibold text-sm text-gray-800'>
                        {ride.user?.fullname?.firstname} {ride.user?.fullname?.lastname}
                      </h4>
                      <p className='text-xs text-gray-400'>{ride.user?.email}</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='text-xl font-bold text-green-600'>Rs.{ride.fare}</div>
                    <div className='text-xs text-gray-400'>{ride.distance} km</div>
                  </div>
                </div>

                {/* Route */}
                <div className='space-y-1.5 mb-2.5 pl-0.5'>
                  <div className='flex items-start gap-2.5'>
                    <div className='mt-0.5'><div className='w-2 h-2 rounded-full bg-blue-500'></div></div>
                    <div className='flex-1'>
                      <p className='text-[10px] text-gray-500 font-medium'>PICKUP</p>
                      <p className='text-xs text-gray-800 font-medium leading-tight'>{ride.pickup?.address}</p>
                    </div>
                  </div>
                  <div className='flex items-start gap-2.5'>
                    <div className='ml-0.5'><div className='w-0.5 h-3 bg-gray-300'></div></div>
                  </div>
                  <div className='flex items-start gap-2.5'>
                    <div className='mt-0.5'><MapPin size={12} className='text-red-500' fill='#ef4444' /></div>
                    <div className='flex-1'>
                      <p className='text-[10px] text-gray-500 font-medium'>DESTINATION</p>
                      <p className='text-xs text-gray-800 font-medium leading-tight'>{ride.drop?.address}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className='flex items-center justify-between pt-2 border-t border-gray-100'>
                  <div className='flex items-center gap-1 text-xs text-gray-500'>
                    <Navigation size={12} className='text-blue-500' />
                    <span>{ride.distance} km · {ride.duration} min</span>
                  </div>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => handleReject(ride)}
                      className='border border-gray-300 text-gray-600 px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all'
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleAccept(ride)}
                      className='bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-5 py-1.5 rounded-lg font-semibold text-xs transition-all shadow-sm'
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RideRequest