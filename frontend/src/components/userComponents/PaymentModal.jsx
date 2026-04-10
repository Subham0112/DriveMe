import React, { useState } from 'react'
import { X, Banknote, CheckCircle, AlertCircle } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'

const PaymentModal = ({ ride, onClose, onRideCompleted }) => {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('choose') // 'choose' | 'processing' | 'waiting_captain' | 'success' | 'failed'
  const [errorMsg, setErrorMsg] = useState('')

  // ── CASH PAYMENT ─────────────────────────────────────────────
  // Cash does NOT complete the ride — just marks payment intent as cash_pending.
  // Captain must click "Complete Ride" on their side to finish.
  // UserMainPage's socket.on('ride-completed') will auto-reset everything.
  const handleCash = async () => {
    setLoading(true)
    setStep('processing')
    try {
      const res = await fetch(`${API_BASE}/rides/mark-cash`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rideId: ride._id }),
      })
      const data = await res.json()
      if (data.success) {
        setStep('waiting_captain')
      } else {
        setErrorMsg(data.message || 'Could not process request')
        setStep('failed')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('Network error. Please try again.')
      setStep('failed')
    } finally {
      setLoading(false)
    }
  }

  // ── ESEWA PAYMENT ─────────────────────────────────────────────
  // Gets signed form fields from backend, then POSTs to eSewa sandbox.
  // eSewa redirects browser to /payment/success or /payment/failure.
  // PaymentSuccess page verifies signature, completes ride, and socket
  // emits ride-completed to BOTH user and captain.
  const handleEsewa = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/rides/esewa-init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rideId: ride._id, amount: ride.fare }),
      })
      const data = await res.json()
      if (!data.success) {
        alert(data.message || 'Could not initiate eSewa payment')
        setLoading(false)
        return
      }

      // Build and auto-submit a hidden form to eSewa sandbox
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'

      Object.entries(data.formData).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = value
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()
      // Browser navigates away — PaymentSuccess page handles the result
    } catch (err) {
      console.error(err)
      alert('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div className='bg-white w-full max-w-md rounded-t-3xl p-6 pb-8 shadow-2xl'>

        {/* Handle bar */}
        <div className='w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4'></div>

        {/* ── CHOOSE PAYMENT METHOD ── */}
        {step === 'choose' && (
          <>
            <div className='flex items-center justify-between mb-5'>
              <div>
                <h2 className='text-xl font-bold text-gray-900'>Choose Payment</h2>
                <p className='text-sm text-gray-500 mt-0.5'>Total fare: <span className='font-bold text-blue-600'>Rs.{ride?.fare}</span></p>
              </div>
              <button onClick={onClose} className='p-2 rounded-full hover:bg-gray-100'>
                <X size={20} className='text-gray-500' />
              </button>
            </div>

            <div className='space-y-3'>
              {/* Cash option */}
              <button
                onClick={handleCash}
                disabled={loading}
                className='w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-2xl hover:border-green-400 hover:bg-green-50 transition-all group'
              >
                <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors'>
                  <Banknote size={22} className='text-green-600' />
                </div>
                <div className='text-left'>
                  <p className='font-bold text-gray-900 text-base'>Cash in Hand</p>
                  <p className='text-xs text-gray-500'>Pay directly to your captain</p>
                </div>
                <div className='ml-auto'>
                  <div className='w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-green-500'></div>
                </div>
              </button>

              {/* eSewa option */}
              <button
                onClick={handleEsewa}
                disabled={loading}
                className='w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-2xl hover:border-green-600 hover:bg-green-50 transition-all group'
              >
                <div className='w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center'>
                  <span style={{ color: 'white', fontWeight: 700, fontSize: 13, letterSpacing: '-0.5px' }}>eSewa</span>
                </div>
                <div className='text-left'>
                  <p className='font-bold text-gray-900 text-base'>Pay with eSewa</p>
                  <p className='text-xs text-gray-500'>Secure online payment</p>
                </div>
                <div className='ml-auto'>
                  <div className='w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-green-600'></div>
                </div>
              </button>
            </div>

            <p className='text-xs text-gray-400 text-center mt-4'>
              eSewa sandbox — use test ID 9806800001 / Nepal@123
            </p>
          </>
        )}

        {/* ── PROCESSING ── */}
        {step === 'processing' && (
          <div className='flex flex-col items-center py-8 gap-4'>
            <div className='w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin'></div>
            <p className='font-semibold text-gray-700'>Processing...</p>
          </div>
        )}

        {/* ── WAITING FOR CAPTAIN (cash) ── */}
        {step === 'waiting_captain' && (
          <div className='flex flex-col items-center py-6 gap-4'>
            {/* Cash amount */}
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
              <Banknote size={30} className='text-green-600' />
            </div>
            <div className='text-center'>
              <p className='text-xl font-bold text-gray-900'>Hand over cash</p>
              <p className='text-3xl font-bold text-green-600 my-2'>Rs.{ride?.fare}</p>
              <p className='text-sm text-gray-500'>to your captain.</p>
            </div>

            {/* Waiting indicator */}
            <div className='w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3'>
              <div className='w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin flex-shrink-0 mt-0.5'></div>
              <div>
                <p className='text-sm font-semibold text-amber-700'>Waiting for captain</p>
                <p className='text-xs text-amber-600 mt-0.5'>Captain will mark the ride complete on their end. The ride will close automatically.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {step === 'success' && (
          <div className='flex flex-col items-center py-8 gap-3'>
            <CheckCircle size={52} className='text-green-500' />
            <p className='text-xl font-bold text-gray-900'>Payment Successful!</p>
            <p className='text-sm text-gray-500'>Your ride has been completed.</p>
          </div>
        )}

        {/* ── FAILED ── */}
        {step === 'failed' && (
          <div className='flex flex-col items-center py-6 gap-3'>
            <AlertCircle size={52} className='text-red-500' />
            <p className='text-xl font-bold text-gray-900'>Something went wrong</p>
            <p className='text-sm text-gray-500 text-center'>{errorMsg}</p>
            <button
              onClick={() => setStep('choose')}
              className='mt-2 bg-blue-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm'
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentModal