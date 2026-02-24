import React, { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'

const LocationSearchPanel = ({ query, onSelectLocation }) => {
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!query || query.length < 3) return

    const controller = new AbortController()

    const fetchPlaces = async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
        { signal: controller.signal }
      )
      const data = await res.json()
      setResults(data)
    }

    fetchPlaces()
    return () => controller.abort()
  }, [query])

  return (
    <ul className="p-2">
      {results.map(place => (
        <li
          key={place.place_id}
          onClick={() =>
            onSelectLocation({
              name: place.display_name,
              lat: parseFloat(place.lat),
              lng: parseFloat(place.lon),
            })
          }
          className="flex gap-3 p-3 cursor-pointer hover:bg-gray-100 rounded-lg"
        >
          <MapPin className="text-blue-600" />
          <span className="text-sm">{place.display_name}</span>
        </li>
      ))}
    </ul>
  )
}

export default LocationSearchPanel
