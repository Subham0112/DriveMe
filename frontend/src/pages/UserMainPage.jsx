import React from 'react'
import { useState, useRef, useContext, useEffect } from 'react'
import gsap from 'gsap'
import { IoIosArrowDown, IoIosPin } from "react-icons/io"
import DriveMeLogo from '../assets/img/DriveMe-Logo.png'
import ShowRaiders from '../components/userComponents/ShowRaiders'
import UserMap from '../components/userComponents/UserMaps'
import LocationSearchPanel from '../components/userComponents/LocationSearchPanel'
import RiderDetails from '../components/userComponents/RiderDetails'
import UserActiveRide from '../components/userComponents/UserActiveRide'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { UserDataContext } from '../context/UserContext'
import socket from '../socket/socket'

const API_BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'

const UserMainPage = () => {
  const [location, setLocation] = useState('')
  const [destination, setDestination] = useState('')
  const [pickupLocation, setPickupLocation] = useState(null)
  const [destinationLocation, setDestinationLocation] = useState(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [activeInput, setActiveInput] = useState(null)
  const [showRaiders, setShowRaiders] = useState(false)
  const [selectedRider, setSelectedRider] = useState(null)
  const [routeInfo, setRouteInfo] = useState({ distance: 0, duration: 0 })
  const [isBooking, setIsBooking] = useState(false)

  // Ride states
  const [rideStatus, setRideStatus] = useState(null)
  const [acceptedCaptain, setAcceptedCaptain] = useState(null)
  const [activeRide, setActiveRide] = useState(null)
  // Live captain location received via socket during active ride
  const [captainLiveLocation, setCaptainLiveLocation] = useState(null)

  const panelRef = useRef(null)
  const arrowRef = useRef(null)
  const locationRef = useRef(null)
  const activeRidePanelRef = useRef(null)
  const bookingInfoRef = useRef(null)

  const navigate = useNavigate()
  const { user, setUser } = useContext(UserDataContext)

  // FIX: Force-initialize all GSAP-controlled panels to 0 on mount.
  // Tailwind's h-[0] class can be beaten by leftover GSAP inline styles
  // when React re-mounts (HMR, StrictMode double-invoke, navigation back/forward).
  // gsap.set writes height:0 as an inline style which always wins.
  useEffect(() => {
    if (panelRef.current) gsap.set(panelRef.current, { height: 0 })
    if (activeRidePanelRef.current) gsap.set(activeRidePanelRef.current, { height: 0 })
    if (arrowRef.current) gsap.set(arrowRef.current, { opacity: 0 })
  }, [])

  // On mount: restore user from cookie, then register socket
  useEffect(() => {
    const restoreAndRegister = async () => {
      let userId = user?._id

      if (!userId) {
        try {
          const res = await fetch(`${API_BASE}/users/profile`, { credentials: 'include' })
          const data = await res.json()
          if (data?._id) {
            setUser(data)
            userId = data._id
          }
        } catch (err) {
          console.error('Could not restore user profile:', err)
          return
        }
      }

      if (!userId) return
      console.log('Registering user:', userId)
      socket.connect()
      socket.emit('registerUser', userId)

      socket.on('ride-accepted', ({ rideId, captain }) => {
        setRideStatus('accepted')
        setAcceptedCaptain(captain)

        fetch(`${API_BASE}/rides/${rideId}`, { credentials: 'include' })
          .then(r => r.json())
          .then(data => {
            if (data.ride) setActiveRide({ ...data.ride, fare: data.ride.fare })
          })
          .catch(() => {
            setActiveRide({
              _id: rideId,
              pickup: bookingInfoRef.current?.pickup || { address: '' },
              drop: bookingInfoRef.current?.drop || { address: '' },
              fare: bookingInfoRef.current?.fare,
              distance: bookingInfoRef.current?.distance,
              duration: bookingInfoRef.current?.duration,
            })
          })
      })

      socket.on('ride-rejected', () => {
        setRideStatus('rejected')
        setSelectedRider(null)
        setActiveRide(null)
      })

      socket.on('ride-cancelled', () => {
        setRideStatus('cancelled')
        setAcceptedCaptain(null)
        setActiveRide(null)
        setCaptainLiveLocation(null)
        if (activeRidePanelRef.current) {
          gsap.to(activeRidePanelRef.current, { duration: 0.4, height: 0, ease: 'power2.out' })
        }
      })

      socket.on('captain-location-update', ({ lat, lng }) => {
        setCaptainLiveLocation({ lat, lng })
      })

      socket.on('ride-completed', () => {
        setRideStatus(null)
        setAcceptedCaptain(null)
        setActiveRide(null)
        setCaptainLiveLocation(null)
        setLocation('')
        setDestination('')
        setPickupLocation(null)
        setDestinationLocation(null)
        setRouteInfo({ distance: 0, duration: 0 })
      })
    }

    restoreAndRegister()

    return () => {
      socket.off('ride-accepted')
      socket.off('ride-rejected')
      socket.off('ride-cancelled')
      socket.off('ride-completed')
      socket.off('captain-location-update')
    }
  }, [])

  // Animate active ride panel in/out
  useEffect(() => {
    if (activeRide && activeRidePanelRef.current) {
      gsap.to(activeRidePanelRef.current, { duration: 0.6, height: '55vh', ease: 'power3.out' })
    } else if (!activeRide && activeRidePanelRef.current) {
      gsap.to(activeRidePanelRef.current, { duration: 0.4, height: 0, ease: 'power2.out' })
    }
  }, [activeRide])

  const fetchRouteInfo = async (pickup, dest) => {
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${dest.lng},${dest.lat}?overview=false`
      )
      const data = await res.json()
      if (data.routes && data.routes.length > 0) {
        return {
          distance: parseFloat((data.routes[0].distance / 1000).toFixed(1)),
          duration: Math.round(data.routes[0].duration / 60),
        }
      }
    } catch (err) {
      console.error('Route info fetch error:', err)
    }
    return { distance: 0, duration: 0 }
  }

  const handlePanelOpen = (inputType) => {
    setShowRaiders(false)
    setSelectedRider(null)
    if (!panelOpen) {
      gsap.to(panelRef.current, { duration: 0.7, height: '50vh', opacity: 1, ease: 'power2.out' })
      gsap.to(arrowRef.current, { duration: 0.7, opacity: 1, ease: 'power2.out' })
    }
    setPanelOpen(true)
    setActiveInput(inputType)
  }

  const handlePanelClose = () => {
    if (panelOpen) {
      gsap.to(panelRef.current, { duration: 0.5, height: 0, ease: 'power2.out' })
      gsap.to(arrowRef.current, { duration: 0.3, opacity: 0, ease: 'power2.in' })
    }
    setActiveInput(null)
    setShowRaiders(false)
    setPanelOpen(false)
    setSelectedRider(null)
  }

  const handleLocationSelect = (place) => {
    if (activeInput === 'location') {
      setLocation(place.name)
      setPickupLocation(place)
    } else {
      setDestination(place.name)
      setDestinationLocation(place)
    }
  }

  const handleSelectRider = (rider) => {
    setSelectedRider(rider)
    gsap.to(panelRef.current, { duration: 0.6, height: '50vh', overflow: 'auto', ease: 'power2.out' })
    gsap.to(locationRef.current, { duration: 0.5, maxHeight: 0, ease: 'power3.out' })
    gsap.to(arrowRef.current, { duration: 0.3, opacity: 0, ease: 'power2.in' })
  }

  const handleBackToRaiders = () => {
    setSelectedRider(null)
    gsap.to(panelRef.current, { duration: 0.6, height: '50vh', ease: 'power3.out' })
    gsap.to(locationRef.current, { duration: 0.5, maxHeight: '40vh', padding: '5px 15px', ease: 'power3.out' })
    gsap.to(arrowRef.current, { duration: 0.4, opacity: 1, ease: 'power2.out' })
  }

  const handleBookRide = async () => {
    if (!selectedRider || !pickupLocation || !destinationLocation) return
    setIsBooking(true)

    bookingInfoRef.current = {
      pickup: { address: pickupLocation.name || pickupLocation.address || location },
      drop: { address: destinationLocation.name || destinationLocation.address || destination },
      fare: selectedRider.fare,
      distance: routeInfo.distance,
      duration: routeInfo.duration,
    }

    try {
      const res = await fetch(`${API_BASE}/rides/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: user?._id,
          captainId: selectedRider._id,
          pickup: pickupLocation,
          drop: destinationLocation,
          fare: selectedRider.fare,
          distance: routeInfo.distance,
          duration: routeInfo.duration,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setRideStatus('waiting')
        gsap.to(locationRef.current, { maxHeight: '40vh', padding: '5px 15px' })
        handlePanelClose()
      } else {
        alert(data.message || 'Booking failed. Please try again.')
      }
    } catch (err) {
      console.error('Booking error:', err)
      alert('Network error. Please try again.')
    } finally {
      setIsBooking(false)
    }
  }

  const handleRideCancelled = () => {
    setActiveRide(null)
    setAcceptedCaptain(null)
    setRideStatus(null)
    setCaptainLiveLocation(null)
    setLocation('')
    setDestination('')
    setPickupLocation(null)
    setDestinationLocation(null)
    setRouteInfo({ distance: 0, duration: 0 })
    gsap.to(locationRef.current, { maxHeight: '40vh', padding: '5px 15px' })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    if (location && destination && pickupLocation && destinationLocation) {
      const info = await fetchRouteInfo(pickupLocation, destinationLocation)
      setRouteInfo(info)
      setShowRaiders(true)
      setActiveInput(null)
      if (!panelOpen) {
        gsap.to(panelRef.current, { duration: 0.6, height: '50vh', opacity: 1, ease: 'power3.out' })
        gsap.to(arrowRef.current, { duration: 0.4, opacity: 1, ease: 'power2.out' })
        setPanelOpen(true)
      }
    }
  }

  return (
    <div className='h-screen w-screen relative overflow-hidden'>
      <Navbar userType="user" />
      <div className='h-screen w-screen md:ml-64'>
        <img src={DriveMeLogo} alt="DriveMe Logo" className="w-24 h-12 absolute left-5 top-5 md:hidden z-10" />
        <div className='h-screen w-full'>
          <UserMap
            pickup={pickupLocation}
            destination={destinationLocation}
            captainLocation={captainLiveLocation}
          />
        </div>

        {/* Waiting banner */}
        {rideStatus === 'waiting' && !activeRide && (
          <div className='absolute top-20 left-1/2 -translate-x-1/2 z-[3000] bg-white shadow-xl rounded-2xl px-6 py-4 flex items-center gap-3 border border-blue-100'>
            <div className='w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
            <div>
              <p className='font-semibold text-gray-800'>Waiting for captain...</p>
              <p className='text-xs text-gray-500'>Your request has been sent</p>
            </div>
          </div>
        )}

        {/* Rejected banner */}
        {rideStatus === 'rejected' && (
          <div className='absolute top-20 left-1/2 -translate-x-1/2 z-[3000] bg-white shadow-xl rounded-2xl px-6 py-4 border border-red-100'>
            <p className='font-bold text-red-500 text-base'>Ride Rejected</p>
            <p className='text-sm text-gray-500 mt-1'>The captain is unavailable. Please choose another.</p>
            <button
              onClick={() => {
                setRideStatus(null)
                setShowRaiders(true)
                setPanelOpen(true)
                gsap.to(panelRef.current, { height: '50vh', opacity: 1 })
                gsap.to(arrowRef.current, { opacity: 1 })
                gsap.to(locationRef.current, { maxHeight: '40vh', padding: '5px 15px' })
              }}
              className='mt-3 bg-blue-500 text-white text-xs px-4 py-1.5 rounded-lg'
            >
              Choose Another
            </button>
          </div>
        )}

        {/* Captain cancelled banner */}
        {rideStatus === 'cancelled' && !activeRide && (
          <div className='absolute top-20 left-1/2 -translate-x-1/2 z-[3000] bg-white shadow-xl rounded-2xl px-6 py-4 border border-orange-100'>
            <p className='font-bold text-orange-500 text-base'>Ride Cancelled</p>
            <p className='text-sm text-gray-500 mt-1'>Your captain cancelled the ride.</p>
            <button onClick={() => setRideStatus(null)} className='mt-3 text-xs text-gray-400 underline'>Dismiss</button>
          </div>
        )}

        <div className='flex flex-col justify-end h-screen absolute top-0 w-full md:w-[calc(100vw-16rem)] pb-16 md:pb-0 overflow-auto pointer-events-none'>

          {/* Search form */}
          {!activeRide && (
            <div ref={locationRef} className='px-[15px] py-[5px] bg-white relative z-[2000] md:max-w-md md:mx-auto md:rounded-t-2xl md:shadow-xl max-h-[40vh] pointer-events-auto'>
              <IoIosArrowDown ref={arrowRef} className='text-3xl opacity-0 absolute top-2 right-5 text-gray-500 cursor-pointer z-20' onClick={handlePanelClose} />
              <h4 className='text-xl font-bold'>Find a Ride</h4>
              <form onSubmit={submitHandler}>
                <div className='absolute left-[21px] top-[68px] flex flex-col items-center'>
                  <div className='w-3 h-3 rounded-full bg-blue-500'></div>
                  <div className='w-0.5 h-16 bg-gradient-to-b from-blue-500 via-gray-400 to-indigo-500'></div>
                  <div className='w-3 h-3 rounded-full bg-indigo-500'></div>
                </div>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onClick={() => handlePanelOpen('location')}
                  className='w-full rounded-lg pl-10 pr-4 py-3 bg-gray-100 mt-4 text-base border-2 border-gray-200 focus:border-blue-500 focus:bg-white transition-all outline-none'
                  type="text"
                  placeholder='Add Your Pickup Location'
                />
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onClick={() => handlePanelOpen('destination')}
                  className='w-full rounded-lg pl-10 pr-4 py-3 bg-gray-100 mt-4 text-base border-2 border-gray-200 focus:border-indigo-500 focus:bg-white transition-all outline-none'
                  type="text"
                  placeholder='Add Your Destination'
                />
              </form>

              {routeInfo.distance > 0 && showRaiders && (
                <p className='text-xs text-gray-500 mt-1'>
                  {routeInfo.distance} km &nbsp;·&nbsp; ~{routeInfo.duration} min ride
                </p>
              )}

              <button
                className='bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1.5 rounded-lg mt-3 font-semibold flex items-center justify-center'
                onClick={submitHandler}
              >
                <IoIosPin className='w-5 h-5 mr-1.5' />
                <span>Find a Ride</span>
              </button>
            </div>
          )}

          {/* Search results / raiders / rider details panel
              style={{ height: 0 }} acts as a guaranteed starting point that
              beats both Tailwind classes and any previously applied GSAP styles */}
          {!activeRide && (
            <div
              ref={panelRef}
              style={{ height: 0 }}
              className='bg-white z-[2000] overflow-auto md:max-w-md md:mx-auto md:w-full md:rounded-b-2xl md:shadow-xl md:mb-4 pointer-events-auto'
            >
              {panelOpen && !showRaiders && (
                <LocationSearchPanel
                  query={activeInput === 'location' ? location : destination}
                  onSelectLocation={handleLocationSelect}
                  isPickup={activeInput === 'location'}
                />
              )}
              {panelOpen && showRaiders && !selectedRider && (
                <ShowRaiders
                  onSelectRider={handleSelectRider}
                  distance={routeInfo.distance}
                  duration={routeInfo.duration}
                />
              )}
              {panelOpen && showRaiders && selectedRider && (
                <RiderDetails
                  rider={selectedRider}
                  routeInfo={routeInfo}
                  onBack={handleBackToRaiders}
                  onBookRide={handleBookRide}
                  isBooking={isBooking}
                />
              )}
            </div>
          )}

          {/* Active ride panel */}
          <div
            ref={activeRidePanelRef}
            style={{ height: 0 }}
            className='bg-white z-[2000] overflow-auto md:max-w-md md:mx-auto md:w-full md:rounded-2xl md:shadow-xl md:mb-4 pointer-events-auto'
          >
            {activeRide && acceptedCaptain && (
              <UserActiveRide
                ride={activeRide}
                captain={acceptedCaptain}
                onRideCancelled={handleRideCancelled}
                onRideCompleted={handleRideCancelled}
              />
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default UserMainPage