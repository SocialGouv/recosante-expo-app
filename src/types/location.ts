export interface UserAddress {
  municipality_insee_code: string;
  municipality_name: string;
  municipality_full_name: string;
  municipality_zip_code: string;
  id?: string;
  title?: string; // same as municipality_full_name, but required in autocomplete
  label?: string; // same as municipality_full_name, but required in autocomplete
}

export interface GeoApiFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: GeoApiProperty;
}

export interface GeoApiProperty {
  label: string;
  score: number;
  housenumber: string;
  id: string;
  name: string;
  postcode: string;
  citycode: string;
  x: number;
  y: number;
  city: string;
  district: string;
  context: string;
  type: string;
  importance: number;
  street: string;
  distance: number;
}
