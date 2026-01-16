export interface Hospital {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

export interface Ambulance {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

export interface NearestAmbulanceResponse {
  ambulance: Ambulance;
  distanceMeters: number;
  cached: boolean;
}
