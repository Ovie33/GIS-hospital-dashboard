import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import type { Hospital, NearestAmbulanceResponse } from "../types";

type Props = {
  center: [number, number];
  hospitals: Hospital[];
  nearest: NearestAmbulanceResponse | null;
  onSelectHospital: (hospital: Hospital) => void;
};

export function MapView({ center, hospitals, nearest, onSelectHospital }: Props) {
  return (
    <main style={{ flex: 1, position: "relative", height: "calc(100vh - 56px)"}}>
      <MapContainer center={center} zoom={13} style={{ height: "100vh", width: "100vw" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

    {/* Hospital markers to show the hospital and the closest ambulance when clicked only */}
        {hospitals.map((h) => (
          <CircleMarker key={h.id} center={[h.lat, h.lng]} radius={8} pathOptions={{   color: "#2563eb",   fillColor: "#2563eb",  fillOpacity: 0.9,}}>
            <Popup>
              <div style={{ minWidth: 220 }}>
                <div style={{ fontWeight: 700 }}>{h.name}</div>
                <div>ID: {h.id}</div>
                <button
                  onClick={() => onSelectHospital(h)}
                  style={{
                    marginTop: 8,
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Find nearest ambulance
                </button>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {nearest && (
          <Marker  position={[nearest.ambulance.lat, nearest.ambulance.lng]}>
            <Popup>
              <div style={{ minWidth: 220 }}>
                <div style={{ fontWeight: 700 }}>{nearest.ambulance.name}</div>
                <div>Distance: {nearest.distanceMeters.toFixed(2)} m</div>
                <div>Cached: {String(nearest.cached)}</div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </main>
  );
}
