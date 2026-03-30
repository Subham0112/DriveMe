import React, { useEffect, useState } from 'react'
import { IoIosStar } from 'react-icons/io'



const ShowRaiders = ({ onSelectRider, distance, duration }) => {
  const [captains, setCaptains] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ✅ Fetch real active captains from backend
  useEffect(() => {
    const fetchCaptains = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/rides/nearby-captains`)
        const data = await res.json()

        if (data.success) {
          // ✅ Compute fare for each captain based on distance & their farePerKm
        const captainsWithFare = data.captains.map(captain => {
        const farePerKm = captain.farePerKm || 20;
        return {
                 ...captain,
                     fare: distance > 0
                     ? parseFloat((farePerKm * distance).toFixed(0))
                      : farePerKm * 3,
                        }
                        })
          setCaptains(captainsWithFare)
        } else {
          setError('Could not load captains')
        }
      } catch (err) {
        console.error('Fetch captains error:', err)
        setError('Network error. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchCaptains()
  }, [distance])

  if (loading) {
    return (
      <div className='flex items-center justify-center py-10'>
        <div className='text-center'>
          <div className='w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2'></div>
          <p className='text-sm text-gray-500'>Finding riders near you...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex items-center justify-center py-10'>
        <p className='text-sm text-red-500'>{error}</p>
      </div>
    )
  }

  if (captains.length === 0) {
    return (
      <div className='flex items-center justify-center py-10'>
        <p className='text-sm text-gray-500'>No riders available right now. Try again shortly.</p>
      </div>
    )
  }

  return (
    <>
      <h3 className='text-center text-lg mt-2 font-semibold'>
        Available Raiders
      </h3>
      <ul className='mt-2 px-4'>
        {captains.map((captain) => (
          <li 
            key={captain._id}
            onClick={() => onSelectRider(captain)}
            className='flex shadow-lg shadow-gray-300/50 items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-all cursor-pointer border border-gray-100 mb-3'
          >
            {/* Avatar: initials since captains may not have a photo */}
            <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0'>
              <span className='text-white font-bold text-base'>
                {captain.fullname?.firstname?.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className='flex-1 min-w-0'>
              <div className='font-semibold text-gray-900'>
                {captain.fullname?.firstname} {captain.fullname?.lastname}
              </div>
              <div className='text-sm text-gray-500 truncate'>
                {captain.vehicle?.vehicleType} · {captain.vehicle?.color}
              </div>
              <div className='flex items-center mt-0.5'>
                <IoIosStar className='text-yellow-400 w-3 h-3 mr-0.5' />
                <span className='text-xs text-gray-400'>
                  {captain.vehicle?.plate}
                </span>
              </div>
            </div>

            <div className='text-right'>
              <div className='text-lg font-bold text-gray-900'>
                Rs.{captain.fare}
              </div>
              <div className='text-xs text-gray-500'>{distance} km</div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default ShowRaiders