import type { Hospital, NearestAmbulanceResponse } from "./types";

const BASE_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

export async function fetchHospitals(): Promise<Hospital[]> {
  const res = await fetch(`${BASE_URL}/hospitals`);
  return handleJson<Hospital[]>(res);
}

export async function fetchNearestAmbulance(hospitalId: number): Promise<NearestAmbulanceResponse> {
  const res = await fetch(`${BASE_URL}/hospitals/${hospitalId}/nearest-ambulance`);
  return handleJson<NearestAmbulanceResponse>(res);
}
