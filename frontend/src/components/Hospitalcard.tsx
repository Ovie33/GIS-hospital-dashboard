import type { Hospital, NearestAmbulanceResponse } from "../types";

type Props = {
  hospital: Hospital;
  active: boolean;
  loading: boolean;
  nearest: NearestAmbulanceResponse | null;
  onSelect: (hospital: Hospital) => void;
};

export function HospitalCard({ hospital, active, loading, nearest, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(hospital)}
      style={{
        textAlign: "left",
        padding: 12,
        borderRadius: 12,
        border: active ? "1px solid #111" : "1px solid #ddd",
        background: active ? "#f4f4f4" : "#fff",
        cursor: "pointer",
        color: "#000",
      }}
    >
      <div style={{ fontWeight: 700 }}>{hospital.name}</div>
      <div style={{ fontSize: 12, opacity: 0.7 }}>ID: {hospital.id}</div>

      {loading && <div style={{ marginTop: 6, fontSize: 12 }}>Finding nearest ambulance…</div>}

      {nearest && (
        <div style={{ marginTop: 6, fontSize: 12 }}>
          <div>
            <b>Nearest:</b> {nearest.ambulance.name}
          </div>
          <div>
            <b>Distance:</b> {nearest.distanceMeters.toFixed(2)} m
          </div>
          <div>
            <b>Cached:</b> {String(nearest.cached)}
          </div>
        </div>
      )}
    </button>
  );
}
