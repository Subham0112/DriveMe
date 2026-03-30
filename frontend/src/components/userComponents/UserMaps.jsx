import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MdMyLocation } from 'react-icons/md'

// Fix marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const defaultCenter = [26.4559, 87.2802] // Biratnagar default

// Small solid dot icon for user's current position (no big accuracy ring)
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

const UserMap = ({ pickup, destination }) => {
  const [userLocation, setUserLocation] = useState(null)
  const [route, setRoute] = useState([])
  const mapRef = useRef(null)

  // 1. Get GPS location once
  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = [pos.coords.latitude, pos.coords.longitude]
        setUserLocation(loc)
        if (mapRef.current) {
          mapRef.current.flyTo(loc, 17)
        }
      },
      (err) => {
        console.error('Geo error:', err)
        setUserLocation(defaultCenter)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  // 2. Fix gray map
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => mapRef.current.invalidateSize(), 400)
    }
  }, [])

  // 3. Fetch route when both pickup + destination exist; CLEAR route when either is null
  useEffect(() => {
    // FIX: When ride completes, UserMainPage sets pickupLocation/destinationLocation to null.
    // Clearing route here ensures the blue line disappears immediately.
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
        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]])
          setRoute(coords)
          if (mapRef.current) {
            const bounds = L.latLngBounds(coords)
            mapRef.current.fitBounds(bounds, { padding: [50, 50] })
          }
        }
      } catch (err) {
        console.error('Route fetch error', err)
      }
    }

    fetchRoute()
  }, [pickup, destination])

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

        {/* FIX: Only a small dot for user location — no large accuracy circle */}
        {userLocation && (
          <Marker position={userLocation} icon={userDotIcon} />
        )}

        {pickup && <Marker position={[pickup.lat, pickup.lng]} />}
        {destination && <Marker position={[destination.lat, destination.lng]} />}

        {/* FIX: route is [] when ride ends so this renders nothing */}
        {route.length > 0 && (
          <Polyline positions={route} color="#2563eb" weight={5} opacity={0.7} />
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