"use client";
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [2.5, 17.5], // coordinates for central Africa
        zoom: 3, // zoom level adjusted to show mostly Africa
        layers: [
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
          }),
        ],
      });
    }
  }, []);

  return <div id="map" style={{ height: "100vh", width: "100%" }}></div>;
};

export default Map;
