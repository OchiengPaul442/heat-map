"use client";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { BounceLoader } from "react-spinners";

const apiKey = process.env.NEXT_PUBLIC_WAQ_API_KEY;

// some locations in Africa
const locations = [
  { name: "Cairo", lat: 30.0444, lon: 31.2357 },
  { name: "Lagos", lat: 6.5244, lon: 3.3792 },
  { name: "Nairobi", lat: -1.286389, lon: 36.817223 },
  { name: "Johannesburg", lat: -26.2044, lon: 28.0456 },
  { name: "Cape Town", lat: -33.9253, lon: 18.4239 },
  { name: "Accra", lat: 5.6037, lon: -0.187 },
  { name: "Kampala", lat: 0.3136, lon: 32.5811 },
  { name: "Dar es Salaam", lat: -6.8, lon: 39.2833 },
  { name: "Addis Ababa", lat: 9.033, lon: 38.7 },
  { name: "Abidjan", lat: 5.33, lon: -4.03 },
  { name: "Maputo", lat: -25.9667, lon: 32.5833 },
  { name: "Kigali", lat: -1.9536, lon: 30.0606 },
  { name: "Lusaka", lat: -15.4167, lon: 28.2833 },
  { name: "Harare", lat: -17.8292, lon: 31.0522 },
  { name: "Bamako", lat: 12.65, lon: -8 },
  { name: "Dakar", lat: 14.6953, lon: -17.4439 },
  { name: "Freetown", lat: 8.484, lon: -13.2299 },
  { name: "Mogadishu", lat: 2.0411, lon: 45.3426 },
  { name: "Khartoum", lat: 15.5881, lon: 32.5342 },
  { name: "Tunis", lat: 36.8, lon: 10.1833 },
  { name: "Kampala", lat: 0.3136, lon: 32.5811 },
  { name: "Lome", lat: 6.1319, lon: 1.2228 },
  { name: "Lilongwe", lat: -13.9833, lon: 33.7833 },
  { name: "Maseru", lat: -29.3167, lon: 27.4833 },
  { name: "Mbabane", lat: -26.3167, lon: 31.1333 },
];

// Function to get color based on AQI value
const getColor = (aqi: any) => {
  if (aqi <= 50) return "green";
  if (aqi <= 100) return "yellow";
  if (aqi <= 150) return "orange";
  if (aqi <= 200) return "red";
  if (aqi <= 300) return "purple";
  return "maroon";
};

const Map = () => {
  const mapRef = useRef<L.Map | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [0, 0],
        zoom: 3,
        layers: [
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
          }),
        ],
      });

      // Fetch air quality data using axios
      axios
        .get(
          `https://api.waqi.info/map/bounds/?latlng=-90,-180,90,180&token=${apiKey}`
        )
        .then((response) => {
          if (Array.isArray(response.data.data)) {
            // Create an array of lat, lng, intensity
            const heatData = response.data.data.map((item: any) => [
              item.lat,
              item.lon,
              item.aqi,
            ]);
            // Add a heatmap layer to the map
            (L as any).heatLayer(heatData).addTo(mapRef.current);

            // Fetch PM2.5 value and add circle markers for each location
            locations.forEach((location) => {
              axios
                .get(
                  `https://api.waqi.info/feed/geo:${location.lat};${location.lon}/?token=${apiKey}`
                )
                .then((response) => {
                  const aqi = response.data.data.iaqi.pm25.v;
                  const color = getColor(aqi);
                  L.circleMarker([location.lat, location.lon], {
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.5,
                    radius: 10,
                  })
                    .addTo(mapRef.current as L.Map)
                    .bindPopup(`${location.name}<br>PM2.5: ${aqi}`);
                  setLoading(false);
                })
                .catch((error) => {
                  setLoading(false);
                  return;
                });
            });
          } else {
            setLoading(false);
            return;
          }
        })
        .catch((error) => {
          setLoading(false);
          return;
        });
    }
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {loading ? (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-60 z-50 flex items-center justify-center">
          <BounceLoader
            color="#0027b3"
            className="z-50"
            loading={loading}
            size={80}
          />
        </div>
      ) : null}
      <div id="map" className="h-dvh w-full z-40"></div>
    </div>
  );
};

export default Map;
