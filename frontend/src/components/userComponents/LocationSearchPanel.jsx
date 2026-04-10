import React, { useEffect, useState, useRef } from 'react'
import { MapPin, Navigation } from 'lucide-react'


const MORANG_VIEWBOX = '86.8,26.85,87.75,26.15'
// Broader Nepal bounding box as fallback
const NEPAL_VIEWBOX = '80.05,30.45,88.20,26.35'

const LocationSearchPanel = ({ query, onSelectLocation, isPickup = false }) => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [locatingMe, setLocatingMe] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query || query.trim().length < 3) {
      setResults([])
      setError(null)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query.trim())}&limit=8&addressdetails=1&countrycodes=np&viewbox=${MORANG_VIEWBOX}&bounded=0`

        const res = await fetch(url, {
          headers: { 'Accept-Language': 'en', 'Accept': 'application/json' },
        })
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()

        
        const morangBounds = { minLat: 26.1, maxLat: 26.9, minLng: 86.7, maxLng: 87.8 }
        const filtered = data.filter(p => {
          const lat = parseFloat(p.lat)
          const lng = parseFloat(p.lon)
          return lat >= morangBounds.minLat && lat <= morangBounds.maxLat &&
                 lng >= morangBounds.minLng && lng <= morangBounds.maxLng
        })

        // Use filtered if we got results, otherwise show all Nepal results
        const finalResults = filtered.length > 0 ? filtered : data
        setResults(finalResults)

        if (finalResults.length === 0) {
          setError('No locations found in Morang area. Try a more specific name.')
        }
      } catch (err) {
        console.error('Location fetch error:', err)
        setError('Could not fetch locations. Check your connection.')
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }
    setLocatingMe(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          )
          const data = await res.json()
          onSelectLocation({
            name: data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
            lat,
            lng,
          })
        } catch {
          // Fallback: use raw coordinates if reverse geocode fails
          onSelectLocation({
            name: `My Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            lat,
            lng,
          })
        } finally {
          setLocatingMe(false)
        }
      },
      (err) => {
        console.error('Geolocation error:', err)
        alert('Could not get your location. Please allow location access.')
        setLocatingMe(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div className="p-2">
      {/* Use Current Location — only shown for pickup input */}
      {isPickup && (
        <button
          onClick={handleUseCurrentLocation}
          disabled={locatingMe}
          className="w-full flex items-center gap-3 px-3 py-3 mb-1 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-left disabled:opacity-60"
        >
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <Navigation size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-700">
              {locatingMe ? 'Getting your location...' : 'Use Current Location'}
            </p>
            <p className="text-xs text-blue-500">Set your GPS position as pickup</p>
          </div>
          {locatingMe && (
            <div className="ml-auto w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          )}
        </button>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 px-3 py-4 text-gray-400">
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Searching in Morang area...</span>
        </div>
      )}

      {/* Error / no results */}
      {!loading && error && (
        <p className="text-sm text-gray-400 px-3 py-4 text-center">{error}</p>
      )}

      {/* Prompt before typing */}
      {!loading && !error && results.length === 0 && (!query || query.trim().length < 3) && (
        <p className="text-sm text-gray-400 px-3 py-3 text-center">
          Type at least 3 characters to search
        </p>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <ul>
          {results.map((place) => (
            <li
              key={place.place_id}
              onClick={() =>
                onSelectLocation({
                  name: place.display_name,
                  lat: parseFloat(place.lat),
                  lng: parseFloat(place.lon),
                })
              }
              className="flex gap-3 p-3 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MapPin className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
              <span className="text-sm text-gray-700 leading-snug">{place.display_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LocationSearchPanel