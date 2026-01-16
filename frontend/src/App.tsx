import { useEffect, useMemo, useState } from "react";
import type { Hospital, NearestAmbulanceResponse } from "./types";
import { fetchHospitals, fetchNearestAmbulance } from "./api";
import { TopBar } from "./components/Topbar";
import { Sidebar } from "./components/Sidebar";
import { MapView } from "./components/Mapview";

type Status =
  | { state: "idle" }
  | { state: "loading"; hospitalId: number }
  | { state: "error"; message: string }
  | { state: "success"; hospitalId: number; data: NearestAmbulanceResponse };

export default function App() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>({ state: "idle" });

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const data = await fetchHospitals();
        if (alive) setHospitals(data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (alive) setStatus({ state: "error", message: msg });
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const center = useMemo<[number, number]>(() => {
    if (hospitals.length === 0) return [4.8156, 7.0134];
    return [hospitals[0].lat, hospitals[0].lng];
  }, [hospitals]);

  const nearest: NearestAmbulanceResponse | null =
    status.state === "success" ? status.data : null;

  const loadingHospitalId: number | null =
    status.state === "loading" ? status.hospitalId : null;

  const error: string | null = status.state === "error" ? status.message : null;

  async function onSelectHospital(h: Hospital): Promise<void> {
    setSelectedHospitalId(h.id);
    setStatus({ state: "loading", hospitalId: h.id });

    try {
      const data = await fetchNearestAmbulance(h.id);
      setStatus({ state: "success", hospitalId: h.id, data });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus({ state: "error", message: msg });
    }
  }

  const statusText = error ? "API Error" : "API Ready";

  return (
    <div style={{ height: "100vh", display: "grid", gridTemplateRows: "56px 1fr" }}>
      <TopBar title="GIS Hospital Dashboard" statusText={statusText} />

      <div style={{ display: "flex", height: "100%" }}>
        <Sidebar
          hospitals={hospitals}
          selectedHospitalId={selectedHospitalId}
          loadingHospitalId={loadingHospitalId}
          nearest={nearest}
          error={error}
          onSelectHospital={onSelectHospital}
        />

        <MapView
          center={center}
          hospitals={hospitals}
          nearest={nearest}
          onSelectHospital={onSelectHospital}
        />
      </div>
    </div>
  );
}
