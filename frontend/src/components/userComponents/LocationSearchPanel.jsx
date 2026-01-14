import React from 'react'
import { useState } from 'react'
import { Clock, MapPin } from 'lucide-react'


const LocationSearchPanel = ({ onSelectLocation }) => {

  const [suggestedPlaces, setSuggestedPlaces] = useState([
    { name: 'San Francisco Airport', address: 'SFO, San Francisco', distance: '12 miles' },
    { name: 'Union Square', address: 'Powell St, San Francisco', distance: '3 miles' },
    { name: 'Golden Gate Park', address: 'JFK Dr, San Francisco', distance: '5 miles' }
  ])

  const [selectedLocation, setSelectedLocation] = useState(null)

  const selectLocation = (place) => {
    setSelectedLocation(place)
    // Call the parent function to update the input
    if (onSelectLocation) {
      onSelectLocation(place)
    }
  }

  return (
    <>
      <h3 className='text-center text-lg mt-2 font-semibold'>
        Suggested Locations
      </h3>
      <ul className='mt-2'>
        {suggestedPlaces.map((place, index) => (
          <li
            key={index}
            onClick={() => selectLocation(place)}
            className='flex shadow-lg shadow-gray-200/50 items-center space-x-2 mb-3 p-3 hover:bg-gray-100 rounded-lg transition-all text-left cursor-pointer'
          >
            <div className='w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0'>
              <MapPin className='w-5 h-5 text-blue-600' />
            </div>
            <div className='flex-1 min-w-0'>
              <div className='font-medium text-gray-900'>{place.name}</div>
              <div className='text-sm text-gray-500 truncate'>{place.address}</div>
            </div>
            <div className='text-xs text-gray-400'>{place.distance}</div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default LocationSearchPanel