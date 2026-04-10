import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'



const PaymentFailure = () => {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 text-center'>
        <AlertCircle size={56} className='text-red-500 mx-auto mb-4' />
        <p className='text-xl font-bold text-gray-900'>Payment Cancelled</p>
        <p className='text-sm text-gray-500 mt-2'>
          Your eSewa payment was not completed. Your ride is still active — you can try again or pay with cash.
        </p>
        <button
          onClick={() => navigate('/main')}
          className='mt-6 bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold text-sm w-full'
        >
          Back to Ride
        </button>
      </div>
    </div>
  )
}

export default PaymentFailure