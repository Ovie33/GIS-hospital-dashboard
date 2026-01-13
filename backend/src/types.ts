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
  updated_at: string;
}

export interface NearestAmbulance {
  ambulance: Ambulance;
  distanceMeters: number;
}

export interface NearestAmbulanceResponse {
  ambulance: {
    id: number;
    name: string;
    lat: number;
    lng: number;
  };
  distanceMeters: number;
  cached: boolean;
}


export interface AmbulanceDTO {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

export interface NearestAmbulanceCachedValue {
  ambulance: AmbulanceDTO;
  distanceMeters: number;
}

export interface NearestAmbulanceResponse extends NearestAmbulanceCachedValue {
  cached: boolean;
}
