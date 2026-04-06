import React, { useState } from 'react'
import { MapPin } from 'lucide-react'
import { IoIosCar } from 'react-icons/io'
import PaymentModal from './PaymentModal'

const API_BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'

const UserActiveRide = ({ ride, captain, onRideCancelled, onRideCompleted }) => {
  const [loading, setLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const handleCancel = async () => {
    if (!window.confirm('Cancel this ride?')) return
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/rides/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rideId: ride?._id }),
      })
      const data = await res.json()
      if (data.success) {
        onRideCancelled()
      } else {
        alert(data.message || 'Could not cancel ride')
      }
    } catch (err) {
      console.error('Cancel error:', err)
      alert('Network error')
    } finally {
      setLoading(false)
    }
  }

  const captainName = `${captain?.fullname?.firstname || ''} ${captain?.fullname?.lastname || ''}`.trim()

  return (
    <>
      <div className='px-4 py-4 flex flex-col gap-3'>

        {/* Status */}
        <div className='flex items-center gap-2'>
          <div className='w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse'></div>
          <span className='text-sm font-semibold text-green-600'>Captain is on the way!</span>
        </div>

        {/* Captain Info */}
        <div className='flex items-center gap-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4'>
          <div className='w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0'>
            <span className='text-white font-bold text-2xl'>
              {captain?.fullname?.firstname?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className='flex-1'>
            <p className='font-bold text-gray-900 text-base'>{captainName}</p>
            <div className='flex items-center gap-1 mt-0.5'>
              <IoIosCar className='text-gray-500 w-4 h-4' />
              <span className='text-xs text-gray-500 capitalize'>
                {captain?.vehicle?.vehicleType} · {captain?.vehicle?.color}
              </span>
            </div>
            <p className='text-xs font-semibold text-gray-700 mt-0.5'>
              {captain?.vehicle?.plate}
            </p>
          </div>
          <div className='text-right'>
            <p className='text-2xl font-bold text-blue-600'>Rs.{ride?.fare}</p>
            <p className='text-xs text-gray-400'>{ride?.distance} km</p>
          </div>
        </div>

        {/* Route */}
        <div className='bg-white border border-gray-200 rounded-xl p-4 space-y-2'>
          <div className='flex items-start gap-3'>
            <div className='mt-1 w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0'></div>
            <div>
              <p className='text-[10px] text-gray-400 font-semibold'>PICKUP</p>
              <p className='text-sm text-gray-800 font-medium leading-snug'>{ride?.pickup?.address}</p>
            </div>
          </div>
          <div className='ml-1 w-0.5 h-3 bg-gray-200'></div>
          <div className='flex items-start gap-3'>
            <MapPin size={13} className='text-red-500 flex-shrink-0 mt-0.5' fill='#ef4444' />
            <div>
              <p className='text-[10px] text-gray-400 font-semibold'>DESTINATION</p>
              <p className='text-sm text-gray-800 font-medium leading-snug'>{ride?.drop?.address}</p>
            </div>
          </div>
        </div>

        {/* Trip stats */}
        <div className='flex gap-2'>
          <div className='flex-1 bg-gray-50 rounded-xl p-3 text-center border border-gray-100'>
            <p className='text-[10px] text-gray-400'>Distance</p>
            <p className='text-sm font-bold text-gray-800'>{ride?.distance} km</p>
          </div>
          <div className='flex-1 bg-gray-50 rounded-xl p-3 text-center border border-gray-100'>
            <p className='text-[10px] text-gray-400'>Est. Time</p>
            <p className='text-sm font-bold text-gray-800'>{ride?.duration} min</p>
          </div>
          <div className='flex-1 bg-gray-50 rounded-xl p-3 text-center border border-gray-100'>
            <p className='text-[10px] text-gray-400'>Fare</p>
            <p className='text-sm font-bold text-green-600'>Rs.{ride?.fare}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className='flex gap-2 mt-1'>
          <button
            onClick={handleCancel}
            disabled={loading}
            className='flex-1 border-2 border-red-400 text-red-500 py-3 rounded-xl font-semibold text-sm hover:bg-red-50 transition-all disabled:opacity-50'
          >
            {loading ? 'Cancelling...' : 'Cancel Ride'}
          </button>
          <button
            onClick={() => setShowPaymentModal(true)}
            disabled={loading}
            className='flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold text-sm hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg disabled:opacity-50'
          >
            Complete Ride
          </button>
        </div>
      </div>

      {/* Payment Modal — shown when user taps Complete Ride */}
      {showPaymentModal && (
        <PaymentModal
          ride={ride}
          onClose={() => setShowPaymentModal(false)}
          onRideCompleted={onRideCompleted}
        />
      )}
    </>
  )
}

export default UserActiveRide