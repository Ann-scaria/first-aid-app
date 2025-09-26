import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

// Fix default marker icons for React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const HospitalMap = () => {
  const [hospitals, setHospitals] = useState([]);
  const [userLocation, setUserLocation] = useState([12.9716, 77.5946]); // default (Bangalore)
  const [nearestHospital, setNearestHospital] = useState(null);

  useEffect(() => {
    // Get user location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        fetchHospitals(latitude, longitude);
      },
      (error) => console.error("Geolocation error:", error)
    );
  }, []);

  // Fetch hospitals from OpenStreetMap Overpass API
  const fetchHospitals = async (lat, lng) => {
    try {
      const query = `
        [out:json];
        node["amenity"="hospital"](around:5000,${lat},${lng});
        out;
      `;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      const response = await axios.get(url);

      const hospitalList = response.data.elements.map((h) => ({
        name: h.tags.name || "Unknown Hospital",
        lat: h.lat,
        lng: h.lon,
      }));

      setHospitals(hospitalList);

      // Find nearest hospital
      if (hospitalList.length > 0) {
        const nearest = hospitalList.reduce((prev, curr) => {
          const prevDist = getDistance(lat, lng, prev.lat, prev.lng);
          const currDist = getDistance(lat, lng, curr.lat, curr.lng);
          return currDist < prevDist ? curr : prev;
        });
        setNearestHospital(nearest);
      }
    } catch (err) {
      console.error("Error fetching hospitals:", err);
    }
  };

  // Haversine formula to calculate distance (in meters)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <MapContainer
      center={userLocation}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
      />

      {/* User location marker */}
      <Marker position={userLocation}>
        <Popup>Your Location</Popup>
      </Marker>

      {/* Hospital markers */}
      {hospitals.map((hospital, idx) => (
        <Marker key={idx} position={[hospital.lat, hospital.lng]}>
          <Popup>{hospital.name}</Popup>
        </Marker>
      ))}

      {/* Line to nearest hospital */}
      {nearestHospital && (
        <Polyline
          positions={[userLocation, [nearestHospital.lat, nearestHospital.lng]]}
          color="red"
          weight={3}
        />
      )}
    </MapContainer>
  );
};

export default HospitalMap;
