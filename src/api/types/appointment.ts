// src/api/types/inspection.ts
export interface Postcode {
  location_id: number;
  postcode: string;
}

export interface PostcodeResponse {
  success: {
    message: string;
  };
  data: Postcode[];
}

export interface InspectionLocation {
  title: string;
  value: number;
}

export interface LocationResponse {
  success: {
    message: string;
  };
  data: InspectionLocation[];
}
