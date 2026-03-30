import React, { useRef, useState, useContext, useEffect } from 'react'
import Navbar from '../components/Navbar'
import CaptainMap from '../components/captainComponents/CaptainMap'
import DriveMeLogo from '../assets/img/DriveMe-Logo.png'
import { IoIosArrowDown } from "react-icons/io"
import RideRequest from '../components/captainComponents/RideRequest'
import ActiveRide from '../components/captainComponents/ActiveRide'
import gsap from 'gsap'
import { CaptainDataContext } from '../context/CaptainContext'
import socket from '../socket/socket'

const API_BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'

const CaptainMainPage = () => {
  const [rideRequestPanelOpen, setRideRequestPanelOpen] = useState(false)
  const [activeRide, setActiveRide] = useState(null)

  // Real today's stats
  const [todayStats, setTodayStats] = useState({ totalEarned: 0, ridesCompleted: 0 })

  const rideReqRef = useRef(null)
  const { captain, setCaptain } = useContext(CaptainDataContext)

  // Fetch today's stats for the captain
  const fetchTodayStats = async (captainId) => {
    try {
      const res = await fetch(`${API_BASE}/rides/captain-today-stats/${captainId}`, {
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        setTodayStats({ totalEarned: data.totalEarned, ridesCompleted: data.ridesCompleted })
      }
    } catch (err) {
      console.error('Could not fetch today stats:', err)
    }
  }

  // On mount: restore captain from cookie if context is empty, then register socket
  useEffect(() => {
    const restoreAndRegister = async () => {
      let captainId = captain?._id

      if (!captainId) {
        try {
          const res = await fetch(`${API_BASE}/captains/profile`, {
            credentials: 'include',
          })
          const data = await res.json()
          if (data?._id) {
            setCaptain(data)
            captainId = data._id
          }
        } catch (err) {
          console.error('Could not restore captain profile:', err)
          return
        }
      }

      if (!captainId) return
      console.log('Registering captain:', captainId)
      socket.connect()
      socket.emit('registerCaptain', captainId)

      // Fetch today's earnings on load
      fetchTodayStats(captainId)
    }

    restoreAndRegister()
  }, [])

  const handleRideRequestPanelToggle = () => {
    if (!rideRequestPanelOpen) {
      gsap.to(rideReqRef.current, { duration: 0.7, height: "70%", ease: 'power2.out' })
      setRideRequestPanelOpen(true)
    } else {
      gsap.to(rideReqRef.current, { duration: 0.5, height: 0, ease: 'power2.out' })
      setRideRequestPanelOpen(false)
    }
  }

  const handleRideAccepted = ({ ride }) => {
    setActiveRide(ride)
    if (rideRequestPanelOpen) {
      gsap.to(rideReqRef.current, { duration: 0.5, height: 0, ease: 'power2.out' })
      setRideRequestPanelOpen(false)
    }
  }

  const handleRideEnded = () => {
    setActiveRide(null)
    // Refresh stats after a ride completes or is cancelled
    const captainId = captain?._id
    if (captainId) fetchTodayStats(captainId)
  }

  return (
    <div className='h-screen w-screen relative overflow-hidden'>
      <Navbar userType="captain" />
      <div className='h-screen w-screen md:ml-64 pb-16 md:pb-0'>
        <img src={DriveMeLogo} alt="DriveMe Logo" className="w-24 h-12 absolute left-5 top-5 md:hidden" />

        <div className='h-screen w-full'>
          <CaptainMap
            pickup={activeRide ? { lat: activeRide.pickup?.latitude, lng: activeRide.pickup?.longitude } : null}
            destination={activeRide ? { lat: activeRide.drop?.latitude, lng: activeRide.drop?.longitude } : null}
          />
        </div>

        <div className='flex flex-col justify-end h-screen absolute top-0 w-full md:w-[calc(100vw-16rem)] pb-16 md:pb-0 overflow-auto pointer-events-none'>

          <div className='pointer-events-auto bg-white relative z-[2000] w-full md:w-[75%] md:mx-auto md:rounded-t-2xl md:shadow-xl'>
            {activeRide ? (
              // Active ride replaces earnings panel
              <div className='min-h-[220px]'>
                <ActiveRide ride={activeRide} onRideEnded={handleRideEnded} />
              </div>
            ) : (
              // Today's real earnings + show ride requests
              <div className='px-8 py-4 h-[30%] bg-white flex gap-8 relative z-[2000] w-full md:rounded-t-2xl'>
                <div className='flex-[1.5]'>
                  <h3 className='text-gray-700 font-semibold text-base mb-3'>Today's Earnings</h3>
                  <div className='flex gap-6 items-center'>
                    <div>
                      <p className='text-sm text-gray-600 mb-1'>Total Earned</p>
                      <p className='text-3xl font-bold text-green-600'>
                        Rs.{todayStats.totalEarned}
                      </p>
                    </div>
                    <div className='w-px h-16 bg-gray-200'></div>
                    <div>
                      <p className='text-sm text-gray-600 mb-1'>Rides Completed</p>
                      <p className='text-3xl font-bold text-orange-600'>
                        {todayStats.ridesCompleted}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='w-px bg-gray-300'></div>

                <div className='flex-1 flex flex-col justify-center'>
                  <h4 className='text-gray-700 font-semibold text-base mb-3'>
                    Available Ride Request: <span className='font-bold text-indigo-500'>–</span>
                  </h4>
                  <button
                    onClick={handleRideRequestPanelToggle}
                    className='bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg text-base font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105'
                  >
                    {rideRequestPanelOpen ? "Hide Ride Requests" : "Show Ride Requests"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {!activeRide && (
            <div ref={rideReqRef} className='h-[0%] bg-white z-[2000] overflow-auto pointer-events-auto w-full md:w-[75%] md:mx-auto md:shadow-xl'>
              <RideRequest onRideAccepted={handleRideAccepted} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CaptainMainPage