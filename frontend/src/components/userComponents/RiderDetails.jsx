import React from 'react'
import { IoIosArrowBack, IoIosCar, IoIosStar, IoIosPin } from "react-icons/io";

const RiderDetails = ({ rider, onBack, onBookRide }) => {
  return (
    <>
      <div className='flex items-center mb-4 px-4 pt-2'>
        <IoIosArrowBack 
          className='text-2xl text-gray-600 cursor-pointer' 
          onClick={onBack}
        />
      </div>

      <div className='px-4 pb-4'>
        {/* Rider Profile Section */}
        <div className='flex items-center space-x-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl mb-4'>
          <div className='w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden'>
            <img 
              src={rider?.image || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'} 
              alt='Rider' 
              className='w-full h-full object-cover' 
            />
          </div>
          <div className='flex-1'>
            <h4 className='font-bold text-xl text-gray-900'>{rider?.name || 'John Smith'}</h4>
            <div className='flex items-center space-x-2 mt-1'>
              <div className='flex items-center'>
                <IoIosStar className='text-yellow-500 w-4 h-4' />
                <span className='text-sm font-semibold ml-1'>{rider?.rating || '4.8'}</span>
              </div>
              <span className='text-sm text-gray-500'>({rider?.trips || '234'} trips)</span>
            </div>
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
              <p className='text-xs text-gray-500'>Model</p>
              <p className='text-sm font-medium text-gray-900'>{rider?.vehicle || 'Toyota Camry'}</p>
            </div>
            <div>
              <p className='text-xs text-gray-500'>Plate Number</p>
              <p className='text-sm font-medium text-gray-900'>{rider?.plateNumber || 'ABC 1234'}</p>
            </div>
            <div>
              <p className='text-xs text-gray-500'>Color</p>
              <p className='text-sm font-medium text-gray-900'>{rider?.color || 'Silver'}</p>
            </div>
            <div>
              <p className='text-xs text-gray-500'>Capacity</p>
              <p className='text-sm font-medium text-gray-900'>{rider?.capacity || '4'} passengers</p>
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
              <span className='text-sm font-medium text-gray-900'>{rider?.distance || '5.2'} km</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>Estimated Time</span>
              <span className='text-sm font-medium text-gray-900'>{rider?.duration || '15'} mins</span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-600'>Arrival Time</span>
              <span className='text-sm font-medium text-gray-900'>{rider?.arrivalTime || '2'} mins</span>
            </div>
            <div className='border-t border-gray-200 pt-3 mt-3 flex justify-between items-center'>
              <span className='text-base font-semibold text-gray-900'>Total Fare</span>
              <span className='text-2xl font-bold text-blue-600'>${rider?.price || '15'}</span>
            </div>
          </div>
        </div>

        {/* Book Ride Button */}
        <button 
          onClick={onBookRide}
          className='w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-semibold text-base hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg'
        >
          Book Ride
        </button>
      </div>
    </>
  )
}

export default RiderDetails