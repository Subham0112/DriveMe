import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, AlertCircle } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'



const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying') 
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verify = async () => {
      // eSewa sends: ?data={base64_encoded_json}
      const encodedData = searchParams.get('data')
      if (!encodedData) {
        setStatus('failed')
        setMessage('No payment data received from eSewa.')
        return
      }

      try {
    
        const decoded = JSON.parse(atob(encodedData))
   
        const parts = decoded.transaction_uuid?.split('-')
       
        const rideId = parts?.[1]

        if (!rideId) {
          setStatus('failed')
          setMessage('Could not identify ride from payment data.')
          return
        }

        // Send to backend for HMAC signature verification + ride completion
        const res = await fetch(`${API_BASE}/rides/esewa-verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ encodedData, rideId }),
        })
        const data = await res.json()

        if (data.success) {
          setStatus('success')
          // Redirect to user home after 2.5 seconds
          setTimeout(() => navigate('/main'), 2500)
        } else {
          setStatus('failed')
          setMessage(data.message || 'Payment verification failed.')
        }
      } catch (err) {
        console.error('Verification error:', err)
        setStatus('failed')
        setMessage('An error occurred during verification. Contact support.')
      }
    }

    verify()
  }, [])

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 text-center'>

        {status === 'verifying' && (
          <>
            <div className='w-14 h-14 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
            <p className='text-lg font-bold text-gray-800'>Verifying Payment...</p>
            <p className='text-sm text-gray-500 mt-1'>Please wait, do not close this page.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle size={56} className='text-green-500 mx-auto mb-4' />
            <p className='text-xl font-bold text-gray-900'>Payment Successful!</p>
            <p className='text-sm text-gray-500 mt-2'>Your ride has been completed.</p>
            <p className='text-xs text-gray-400 mt-3'>Redirecting you home...</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <AlertCircle size={56} className='text-red-500 mx-auto mb-4' />
            <p className='text-xl font-bold text-gray-900'>Verification Failed</p>
            <p className='text-sm text-gray-500 mt-2'>{message}</p>
            <button
              onClick={() => navigate('/main')}
              className='mt-5 bg-blue-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm w-full'
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default PaymentSuccess