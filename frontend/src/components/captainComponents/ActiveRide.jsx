import React, { useState } from 'react'
import { MapPin, Navigation } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'

const ActiveRide = ({ ride, onRideEnded }) => {
  const [loading, setLoading] = useState(false)

  const handleCancel = async () => {
    if (!window.confirm('Cancel this ride?')) return
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/rides/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rideId: ride._id }),
      })
      const data = await res.json()
      if (data.success) {
        onRideEnded()
      } else {
        alert(data.message || 'Could not cancel')
      }
    } catch (err) {
      console.error('Cancel error:', err)
      alert('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/rides/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rideId: ride._id }),
      })
      const data = await res.json()
      if (data.success) {
        onRideEnded()
      } else {
        alert(data.message || 'Could not complete')
      }
    } catch (err) {
      console.error('Complete error:', err)
      alert('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='px-6 py-4 h-full flex flex-col gap-4'>
      {/* Status badge */}
      <div className='flex items-center gap-2'>
        <div className='w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse'></div>
        <span className='text-sm font-semibold text-green-600'>Ride in Progress</span>
      </div>

      {/* User info */}
      <div className='flex items-center gap-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4'>
        <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0'>
          <span className='text-white font-bold text-xl'>
            {ride?.user?.fullname?.firstname?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        <div>
          <p className='font-bold text-gray-900 text-base'>
            {ride?.user?.fullname?.firstname} {ride?.user?.fullname?.lastname}
          </p>
          <p className='text-xs text-gray-500'>{ride?.user?.email}</p>
        </div>
        <div className='ml-auto text-right'>
          <p className='text-2xl font-bold text-blue-600'>Rs.{ride?.fare}</p>
          <p className='text-xs text-gray-400'>{ride?.distance} km</p>
        </div>
      </div>

      {/* Route */}
      <div className='bg-white border border-gray-200 rounded-xl p-4 space-y-3'>
        <div className='flex items-start gap-3'>
          <div className='mt-1 w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0'></div>
          <div>
            <p className='text-[10px] text-gray-400 font-semibold'>PICKUP</p>
            <p className='text-sm text-gray-800 font-medium leading-snug'>{ride?.pickup?.address}</p>
          </div>
        </div>
        <div className='ml-1 w-0.5 h-4 bg-gray-200'></div>
        <div className='flex items-start gap-3'>
          <MapPin size={14} className='text-red-500 flex-shrink-0 mt-0.5' fill='#ef4444' />
          <div>
            <p className='text-[10px] text-gray-400 font-semibold'>DESTINATION</p>
            <p className='text-sm text-gray-800 font-medium leading-snug'>{ride?.drop?.address}</p>
          </div>
        </div>
      </div>

      {/* Trip stats */}
      <div className='flex gap-3'>
        <div className='flex-1 bg-gray-50 rounded-xl p-3 text-center border border-gray-100'>
          <p className='text-xs text-gray-400'>Distance</p>
          <p className='text-base font-bold text-gray-800'>{ride?.distance} km</p>
        </div>
        <div className='flex-1 bg-gray-50 rounded-xl p-3 text-center border border-gray-100'>
          <p className='text-xs text-gray-400'>Est. Time</p>
          <p className='text-base font-bold text-gray-800'>{ride?.duration} min</p>
        </div>
        <div className='flex-1 bg-gray-50 rounded-xl p-3 text-center border border-gray-100'>
          <p className='text-xs text-gray-400'>Fare</p>
          <p className='text-base font-bold text-green-600'>Rs.{ride?.fare}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className='flex gap-3 mt-auto'>
        <button
          onClick={handleCancel}
          disabled={loading}
          className='flex-1 border-2 border-red-400 text-red-500 py-3 rounded-xl font-semibold text-sm hover:bg-red-50 transition-all disabled:opacity-50'
        >
          Cancel Ride
        </button>
        <button
          onClick={handleComplete}
          disabled={loading}
          className='flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold text-sm hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg disabled:opacity-50'
        >
          Complete Ride
        </button>
      </div>
    </div>
  )
}

export default ActiveRide