"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { Component, type ReactNode, useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

export type MapCoordinates = {
  latitude: number;
  longitude: number;
};

export type PotholeLocationMapProps = {
  coordinates: MapCoordinates;
  markerLabel: string;
  mapLabel: string;
  onMarkerMove: (coordinates: MapCoordinates) => void;
  onMapReady: () => void;
  onMapError: () => void;
};

const markerIcon = L.divIcon({
  className: "jalsarthi-map-marker",
  html: '<span aria-hidden="true"></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function MapViewport({ coordinates }: { coordinates: MapCoordinates }) {
  const map = useMap();

  useEffect(() => {
    map.setView([coordinates.latitude, coordinates.longitude], map.getZoom(), { animate: false });
  }, [coordinates, map]);

  return null;
}

class MapErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

export default function PotholeLocationMap({
  coordinates,
  markerLabel,
  mapLabel,
  onMarkerMove,
  onMapReady,
  onMapError,
}: PotholeLocationMapProps) {
  return (
    <MapErrorBoundary onError={onMapError}>
      <MapContainer
        center={[coordinates.latitude, coordinates.longitude]}
        zoom={18}
        scrollWheelZoom
        className="mt-4 h-72 w-full rounded-xl border border-primary-200 sm:h-80"
        aria-label={mapLabel}
      >
        <MapViewport coordinates={coordinates} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          eventHandlers={{ load: onMapReady, tileerror: onMapError }}
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          draggable
          icon={markerIcon}
          position={[coordinates.latitude, coordinates.longitude]}
          title={markerLabel}
          eventHandlers={{
            dragend: (event) => {
              const { lat, lng } = event.target.getLatLng();
              onMarkerMove({ latitude: lat, longitude: lng });
            },
          }}
        />
      </MapContainer>
    </MapErrorBoundary>
  );
}
