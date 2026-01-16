import { useMemo, useState } from "react";
import type { Hospital, NearestAmbulanceResponse } from "../types";
import { HospitalList } from "./Hospitallist";

type Props = {
  hospitals: Hospital[];
  selectedHospitalId: number | null;
  loadingHospitalId: number | null;
  nearest: NearestAmbulanceResponse | null;
  error: string | null;
  onSelectHospital: (hospital: Hospital) => void;
};

export function Sidebar({
  hospitals,
  selectedHospitalId,
  loadingHospitalId,
  nearest,
  error,
  onSelectHospital,
}: Props) {
  const [query, setQuery] = useState<string>("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return hospitals;
    return hospitals.filter((h) => h.name.toLowerCase().includes(q));
  }, [hospitals, query]);

  const selected = useMemo(() => {
    if (selectedHospitalId === null) return null;
    return hospitals.find((h) => h.id === selectedHospitalId) ?? null;
  }, [hospitals, selectedHospitalId]);

  return (
    <aside
      style={{
        width: 360,
        borderRight: "1px solid #e5e5e5",
        background: "#0000ff",
        padding: 12,
        overflow: "auto",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Hospitals</div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search hospitals…"
        style={{
          width: "100%",
          padding: "10px 12px",
          border: "1px solid #ddd",
          borderRadius: 10,
          outline: "none",
          marginBottom: 12,
        }}
      />

      <HospitalList
        hospitals={filtered}
        selectedHospitalId={selectedHospitalId}
        loadingHospitalId={loadingHospitalId}
        nearestBySelected={nearest}
        onSelect={onSelectHospital}
      />

      <div style={{ marginTop: 14, padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Selection</div>
        {selected ? (
          <div style={{ fontSize: 13 }}>
            <div>
              <b>{selected.name}</b>
            </div>
            <div>Lat: {selected.lat}</div>
            <div>Lng: {selected.lng}</div>
          </div>
        ) : (
          <div style={{ fontSize: 13, opacity: 0.7 }}>Click a hospital to view nearest ambulance.</div>
        )}
      </div>

      {error && (
        <div style={{ marginTop: 12, color: "crimson", fontSize: 13 }}>
          <b>Error:</b> {error}
        </div>
      )}
    </aside>
  );
}
