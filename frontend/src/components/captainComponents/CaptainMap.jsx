import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MdMyLocation } from "react-icons/md";

/*
Fix Leaflet icon bug
*/
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const defaultCenter = [26.4559, 87.2802]; // Biratnagar default

const CaptainMap = () => {
  const [captainLocation, setCaptainLocation] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const mapRef = useRef(null);

  /*
  ---------------------------------------
  Get Captain GPS Location (Live)
  ---------------------------------------
  */
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const loc = [pos.coords.latitude, pos.coords.longitude];

        setCaptainLocation(loc);
        setAccuracy(pos.coords.accuracy);

        if (mapRef.current) {
          mapRef.current.flyTo(loc, 17);
        }

        /*
        IMPORTANT (later)
        Send to backend socket:
        socket.emit("captain-location", loc)
        */
      },
      (err) => {
        console.log("GPS Error", err);
        setCaptainLocation(defaultCenter);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  /*
  Fix gray map issue
  */
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 400);
    }
  }, []);

  const recenterMap = () => {
    if (mapRef.current && captainLocation) {
      mapRef.current.flyTo(captainLocation, 17);
    }
  };

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

        {/* Captain Blue Dot */}
        {captainLocation && (
          <>
            <Circle
              center={captainLocation}
              radius={accuracy || 80}
              pathOptions={{
                color: "#16a34a",
                fillColor: "#22c55e",
                fillOpacity: 0.15,
              }}
            />

            <Circle
              center={captainLocation}
              radius={10}
              pathOptions={{
                color: "white",
                fillColor: "#16a34a",
                fillOpacity: 1,
                weight: 2,
              }}
            />
          </>
        )}
      </MapContainer>

      {/* Recenter Button */}
      <button
        onClick={recenterMap}
        className="absolute bottom-10 right-4 z-[1000] bg-white p-3 rounded-full shadow-xl"
      >
        <MdMyLocation size={22} className="text-green-600" />
      </button>
    </div>
  );
};

export default CaptainMap;