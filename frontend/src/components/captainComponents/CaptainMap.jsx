import React, { useEffect, useState, useRef, useContext } from "react"
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { MdMyLocation } from "react-icons/md"
import socket from "../../socket/socket"
import { CaptainDataContext } from "../../context/CaptainContext"

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

const defaultCenter = [26.4559, 87.2802]

// Orange dot — captain's own position
const captainDotIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 18px; height: 18px;
    background: #fa811f;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 0 0 2px #fa811f55;
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

// CaptainMap now accepts `hasActiveRide` so it only emits location
// when there is actually a ride in progress (saves bandwidth otherwise)
const CaptainMap = ({ pickup, destination, hasActiveRide }) => {
  const [captainLocation, setCaptainLocation] = useState(null)
  const [route, setRoute] = useState([])
  const mapRef = useRef(null)
  const { captain } = useContext(CaptainDataContext)

  // GPS watch — continuously tracks position and emits to socket when ride is active
  useEffect(() => {
    if (!navigator.geolocation) return

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        setCaptainLocation([lat, lng])

        // Only pan map when not on active ride (so captain can see route)
        if (mapRef.current && !hasActiveRide) {
          mapRef.current.flyTo([lat, lng], 17)
        }

        // Emit live location to backend — backend relays to the right user
        if (hasActiveRide && captain?._id && socket.connected) {
          socket.emit('captain-location-update', {
            captainId: captain._id,
            lat,
            lng,
          })
        }
      },
      (err) => {
        console.warn("GPS error:", err)
        setCaptainLocation(defaultCenter)
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [captain?._id, hasActiveRide])

  // Fix gray map on first render
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => mapRef.current.invalidateSize(), 400)
    }
  }, [])

  // Fetch route when active ride has pickup + destination; clear when ride ends
  useEffect(() => {
    if (!pickup || !destination) {
      setRoute([])
      return
    }
    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`
        )
        const data = await res.json()
        if (data.routes?.[0]) {
          const coords = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]])
          setRoute(coords)
          if (mapRef.current) {
            mapRef.current.fitBounds(L.latLngBounds(coords), { padding: [60, 60] })
          }
        }
      } catch (err) {
        console.error("Route fetch error:", err)
      }
    }
    fetchRoute()
  }, [pickup, destination])

  const recenterMap = () => {
    if (mapRef.current && captainLocation) mapRef.current.flyTo(captainLocation, 17)
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={defaultCenter}
        zoom={15}
        scrollWheelZoom={true}
        className="w-full h-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; contributors of OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {captainLocation && (
          <Marker position={captainLocation} icon={captainDotIcon} />
        )}

        {pickup && <Marker position={[pickup.lat, pickup.lng]} />}
        {destination && <Marker position={[destination.lat, destination.lng]} />}
        {route.length > 0 && (
          <Polyline positions={route} color="#2563eb" weight={5} opacity={0.7} />
        )}
      </MapContainer>

      <button
        onClick={recenterMap}
        className="absolute bottom-10 right-4 z-[1000] bg-white p-3 rounded-full shadow-xl active:scale-90 transition-transform"
      >
        <MdMyLocation size={22} className="text-orange-500" />
      </button>
    </div>
  )
}

export default CaptainMap