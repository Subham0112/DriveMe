import React from 'react'
import { IoIosArrowBack, IoIosCar, IoIosPin } from "react-icons/io";

const RiderDetails = ({ rider, routeInfo, onBack, onBookRide, isBooking }) => {
  // rider is a captain object from backend:
  // { _id, fullname, vehicle: { color, plate, capacity, vehicleType }, farePerKm, fare, status }
  // routeInfo: { distance, duration } — computed from OSRM

  const captainName = `${rider?.fullname?.firstname || ''} ${rider?.fullname?.lastname || ''}`.trim()

  return (
    <>
      <div className='flex items-center mb-4 px-4 pt-2'>
        <IoIosArrowBack 
          className='text-2xl text-gray-600 cursor-pointer' 
          onClick={onBack}
        />
      </div>

      <div className='px-4 pb-4'>
        {/* Captain Profile Section */}
        <div className='flex items-center space-x-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl mb-4'>
          {/* Avatar with initials */}
          <div className='w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0'>
            <span className='text-white font-bold text-3xl'>
              {rider?.fullname?.firstname?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className='flex-1'>
            <h4 className='font-bold text-xl text-gray-900'>{captainName}</h4>
            <p className='text-sm text-gray-500 mt-1 capitalize'>
              {rider?.vehicle?.vehicleType}
            </p>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className='bg-white border border-gray-200 rounded-xl p-4 mb-4'>
          <div className='flex items-center mb-3'>
            <IoIosCar className='text-gray-600 w-5 h-5 mr-2' />
            <h5 className='font-semibold text-gray-900'>Vehicle Details</h5>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <p className='text-xs text-gray-500'>Type</p>
              <p className='text-sm font-medium text-gray-900 capitalize'>
                {rider?.vehicle?.vehicleType}
              </p>
            </div>
            <div>
              <p className='text-xs text-gray-500'>Plate Number</p>
              <p className='text-sm font-medium text-gray-900'>
                {rider?.vehicle?.plate}
              </p>
            </div>
            <div>
              <p className='text-xs text-gray-500'>Color</p>
              <p className='text-sm font-medium text-gray-900 capitalize'>
                {rider?.vehicle?.color}
              </p>
            </div>
            <div>
              <p className='text-xs text-gray-500'>Capacity</p>
              <p className='text-sm font-medium text-gray-900'>
                {rider?.vehicle?.capacity} passengers
              </p>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className='bg-white border border-gray-200 rounded-xl p-4 mb-4'>
          <div className='flex items-center mb-3'>
            <IoIosPin className='text-gray-600 w-5 h-5 mr-2' />
            <h5 className='font-semibold text-gray-900'>Trip Details</h5>
          </div>
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>Distance</span>
              <span className='text-sm font-medium text-gray-900'>
                {routeInfo?.distance} km
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>Estimated Time</span>
              <span className='text-sm font-medium text-gray-900'>
                {routeInfo?.duration} mins
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>Rate</span>
              <span className='text-sm font-medium text-gray-900'>
                Rs.{rider?.farePerKm || 20 }/km
              </span>
            </div>
            <div className='border-t border-gray-200 pt-3 mt-3 flex justify-between items-center'>
              <span className='text-base font-semibold text-gray-900'>Total Fare</span>
              <span className='text-2xl font-bold text-blue-600'>
                Rs.{rider?.fare}
              </span>
            </div>
          </div>
        </div>

        {/* Book Ride Button */}
        <button 
          onClick={onBookRide}
          disabled={isBooking}
          className='w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-semibold text-base hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {isBooking ? 'Booking...' : 'Book Ride'}
        </button>
      </div>
    </>
  )
}

export default RiderDetails