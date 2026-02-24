import React from 'react'
import { useState, useRef } from 'react'
import gsap from 'gsap'
import { IoIosArrowDown, IoIosPin } from "react-icons/io";
import DriveMeLogo from '../assets/img/DriveMe-Logo.png'
import ShowRaiders from '../components/userComponents/ShowRaiders';
import UserMap from '../components/userComponents/UserMaps';
import LocationSearchPanel from '../components/userComponents/LocationSearchPanel';
import RiderDetails from '../components/userComponents/RiderDetails';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';


const UserMainPage = () => {
const [location, setLocation] = useState('')
const [destination, setDestination] = useState('')
const [pickupLocation, setPickupLocation] = useState(null)
const [destinationLocation, setDestinationLocation] = useState(null)
const [panelOpen, setPanelOpen] = useState(false)
const [activeInput, setActiveInput] = useState(null)
const [showRaiders, setShowRaiders] = useState(false)
const [selectedRider, setSelectedRider] = useState(null)
const panelRef = useRef(null)
const arrowRef = useRef(null)
const locationRef = useRef(null)
const navigate=useNavigate();

const handlePanelOpen = (inputType) => {
  setShowRaiders(false)
  setSelectedRider(null)
  if (!panelOpen){
    gsap.to(panelRef.current, {
      duration: 0.7,
      height: "50vh",
      opacity: 1,
      ease: 'power2.out',
    })
    gsap.to(arrowRef.current, {
      duration: 0.7,
      opacity: 1,
      ease: 'power2.out',
    })
  }
  setPanelOpen(true)
  setActiveInput(inputType)
}

const handlePanelClose = () => {
  if (panelOpen){
    gsap.to(panelRef.current, {
      duration: 0.5,
      height: 0,
      ease: 'power2.out',
    })
    gsap.to(arrowRef.current, {
      duration: 0.3,
      opacity: 0,
      ease: 'power2.in',
    })
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
  gsap.to(panelRef.current, {
      duration: 0.6,
      height: "50vh",
      overflow: 'auto',
      ease: 'power2.out',
    })
    gsap.to(locationRef.current, {
      duration: 0.5,
      maxHeight:0,
      ease: 'power3.out',
    })
    gsap.to(arrowRef.current, {
      duration: 0.3,
      opacity: 0,
      ease: 'power2.in',
    })
}

const handleBackToRaiders = () => {
  setSelectedRider(null)
   gsap.to(panelRef.current, {
      duration: 0.6,
      height: "50vh",
      ease: 'power3.out',
    })
    gsap.to(locationRef.current, {
      duration: 0.5,
      maxHeight: '40vh',
      padding: '5px 15px',
      ease: 'power3.out',
    })
    gsap.to(arrowRef.current, {
      duration: 0.4,
      opacity: 1,
      ease: 'power2.out',
    })
}

const handleBookRide = () => {
  console.log('Booking ride with:', selectedRider)
  alert('Ride booked successfully!')
     gsap.to(locationRef.current, {
      maxHeight: '40vh',
      padding: '5px 15px',
    })
  handlePanelClose();
}

  const submitHandler = (e) => {
    e.preventDefault()
    
    if (location && destination) {
      setShowRaiders(true)
      setActiveInput(null)
      
      if (!panelOpen) {
        gsap.to(panelRef.current, {
          duration: 0.6,
          height: "50vh",
          opacity: 1,
          ease: 'power3.out',
        })
        gsap.to(arrowRef.current, {
          duration: 0.4,
          opacity: 1,
          ease: 'power2.out',
        })
        setPanelOpen(true)
      }
    }
  }

  return (
    <div className='h-screen w-screen relative overflow-hidden'>
      <Navbar userType="user" />
      
      {/* Main content area - adjusted for sidebar */}
      <div className='h-screen w-screen md:ml-64'>
        {/* Logo - only visible on mobile */}
        <img src={DriveMeLogo} alt="DriveMe Logo" className="w-24 h-12 absolute left-5 top-5 md:hidden z-10" />

        <div className='h-screen w-full'>
         <UserMap  
         pickup={pickupLocation}
         destination={destinationLocation}
         />
        </div>

        <div className='flex flex-col justify-end h-screen absolute top-0 w-full md:w-[calc(100vw-16rem)] pb-16 md:pb-0 overflow-auto  pointer-events-none'>
          <div ref={locationRef} className='px-[15px] py-[5px] bg-[white] relative z-[2000] md:max-w-md md:mx-auto md:rounded-t-2xl md:shadow-xl max-h-[40vh] pointer-events-auto'>
            <IoIosArrowDown ref={arrowRef} className='text-3xl opacity-0 absolute top-2 right-5 text-gray-500 cursor-pointer z-20' onClick={handlePanelClose} />
            <h4 className='text-xl font-bold'>Find a Ride</h4>
            <form onSubmit={submitHandler} >
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
              placeholder='Add Your Pickup Location' />
              <input 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onClick={() => handlePanelOpen('destination')} 
              className='w-full rounded-lg pl-10 pr-4 py-3 bg-gray-100 mt-4 text-base border-2 border-gray-200 focus:border-indigo-500 focus:bg-white transition-all outline-none' 
              type="text" 
              placeholder='Add Your Destination' />
            </form>
            <button className=' bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1.5 rounded-lg mt-3 font-semibold flex items-center justify-center ' onClick={submitHandler}>
              <IoIosPin className='w-5 h-5 mr-1.5' />
              <span>Find a Ride</span>
            </button>
          </div>
          <div ref={panelRef} className='h-[0] bg-white z-[2000] overflow-auto md:max-w-md md:mx-auto md:w-full md:rounded-b-2xl md:shadow-xl md:mb-4 pointer-events-auto'>
            {panelOpen && !showRaiders && <LocationSearchPanel query={activeInput === 'location' ? location : destination} onSelectLocation={handleLocationSelect}/>}
            {panelOpen && showRaiders && !selectedRider && <ShowRaiders onSelectRider={handleSelectRider} />}
            {panelOpen && showRaiders && selectedRider && <RiderDetails rider={selectedRider} onBack={handleBackToRaiders} onBookRide={handleBookRide} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserMainPage