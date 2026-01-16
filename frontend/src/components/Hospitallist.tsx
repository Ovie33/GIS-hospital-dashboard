import type { Hospital, NearestAmbulanceResponse } from "../types";
import { HospitalCard } from "./Hospitalcard";

type Props = {
  hospitals: Hospital[];
  selectedHospitalId: number | null;
  loadingHospitalId: number | null;
  nearestBySelected: NearestAmbulanceResponse | null;
  onSelect: (hospital: Hospital) => void;
};

export function HospitalList({
  hospitals,
  selectedHospitalId,
  loadingHospitalId,
  nearestBySelected,
  onSelect,
}: Props) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {hospitals.map((h) => {
        const active = h.id === selectedHospitalId;
        const loading = h.id === loadingHospitalId;
        const nearest = active ? nearestBySelected : null;

        return (
          <HospitalCard
            key={h.id}
            hospital={h}
            active={active}
            loading={loading}
            nearest={nearest}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
}
