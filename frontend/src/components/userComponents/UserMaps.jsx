import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MdMyLocation } from 'react-icons/md'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const defaultCenter = [26.4559, 87.2802]

// Small blue dot — user's own position
const userDotIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 16px; height: 16px;
    background: #2563eb;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 0 0 2px #2563eb55;
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

// Orange dot with car label — captain's live position
const captainLiveIcon = L.divIcon({
  className: '',
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
      <div style="
        background:#fa811f;
        color:white;
        font-size:10px;
        font-weight:600;
        padding:2px 6px;
        border-radius:6px;
        white-space:nowrap;
        box-shadow:0 1px 4px rgba(0,0,0,0.25);
      ">Captain</div>
      <div style="
        width:18px;height:18px;
        background:#fa811f;
        border:3px solid white;
        border-radius:50%;
        box-shadow:0 0 0 2px #fa811f55;
      "></div>
    </div>`,
  iconSize: [50, 38],
  iconAnchor: [25, 38],
})

// UserMap now accepts captainLocation (lat, lng) from UserMainPage via socket
const UserMap = ({ pickup, destination, captainLocation }) => {
  const [userLocation, setUserLocation] = useState(null)
  const [route, setRoute] = useState([])
  const mapRef = useRef(null)

  // Get user's GPS once on mount
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = [pos.coords.latitude, pos.coords.longitude]
        setUserLocation(loc)
        if (mapRef.current) mapRef.current.flyTo(loc, 17)
      },
      (err) => {
        console.error('Geo error:', err)
        setUserLocation(defaultCenter)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  // Fix gray map
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => mapRef.current.invalidateSize(), 400)
    }
  }, [])

  // Fetch / clear route based on pickup + destination
  useEffect(() => {
    if (!pickup || !destination) {
      setRoute([])
      return
    }
    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&continue_straight=false`
        )
        const data = await res.json()
        if (data.routes?.[0]) {
          const coords = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]])
          setRoute(coords)
          if (mapRef.current) {
            mapRef.current.fitBounds(L.latLngBounds(coords), { padding: [50, 50] })
          }
        }
      } catch (err) {
        console.error('Route fetch error', err)
      }
    }
    fetchRoute()
  }, [pickup, destination])

  // When captain location updates, pan map to include both user + captain
  useEffect(() => {
    if (!captainLocation || !mapRef.current) return
    // Softly pan toward captain — don't fully fly so user can still see the route
    mapRef.current.panTo([captainLocation.lat, captainLocation.lng], { animate: true, duration: 0.8 })
  }, [captainLocation])

  const recenterMap = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.flyTo(userLocation, 17, { animate: true })
    }
  }

  return (
    <div className="relative w-full h-full border-0">
      <MapContainer
        center={defaultCenter}
        zoom={15}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User's own position — small blue dot */}
        {userLocation && <Marker position={userLocation} icon={userDotIcon} />}

        {/* Pickup + destination markers */}
        {pickup && <Marker position={[pickup.lat, pickup.lng]} />}
        {destination && <Marker position={[destination.lat, destination.lng]} />}

        {/* Route polyline — cleared automatically when ride ends */}
        {route.length > 0 && (
          <Polyline positions={route} color="#2563eb" weight={5} opacity={0.7} />
        )}

        {/* Captain's live position — orange dot with label, only shown during active ride */}
        {captainLocation && (
          <Marker
            position={[captainLocation.lat, captainLocation.lng]}
            icon={captainLiveIcon}
          />
        )}
      </MapContainer>

      <button
        onClick={recenterMap}
        className="absolute bottom-10 right-4 z-[1000] bg-white p-3 rounded-full shadow-2xl active:scale-90 transition-transform"
      >
        <MdMyLocation size={24} className="text-blue-600" />
      </button>
    </div>
  )
}

export default UserMap