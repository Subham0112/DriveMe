import React, { useEffect, useState, useRef } from "react"
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { MdMyLocation } from "react-icons/md"

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

const defaultCenter = [26.4559, 87.2802]

// Small solid green dot for captain position — no big accuracy ring
const captainDotIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 18px; height: 18px;
    background: #fa811f;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 0 0 2px #a3721655;
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

const CaptainMap = ({ pickup, destination }) => {
  const [captainLocation, setCaptainLocation] = useState(null)
  const [route, setRoute] = useState([])
  const mapRef = useRef(null)

  // GPS tracking
  useEffect(() => {
    if (!navigator.geolocation) return
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = [pos.coords.latitude, pos.coords.longitude]
        setCaptainLocation(loc)
        if (mapRef.current) mapRef.current.flyTo(loc, 17)
      },
      (err) => {
        console.log("GPS Error", err)
        setCaptainLocation(defaultCenter)
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  // Fix gray map
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => mapRef.current.invalidateSize(), 400)
    }
  }, [])

  // Fetch route for active ride; clear when ride ends
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
        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]])
          setRoute(coords)
          if (mapRef.current) {
            const bounds = L.latLngBounds(coords)
            mapRef.current.fitBounds(bounds, { padding: [60, 60] })
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

        {/* FIX: Small green dot only — no large accuracy circle */}
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
        className="absolute bottom-10 right-4 z-[1000] bg-white p-3 rounded-full shadow-xl"
      >
        <MdMyLocation size={22} className="text-green-600" />
      </button>
    </div>
  )
}

export default CaptainMap