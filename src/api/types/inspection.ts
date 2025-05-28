// src/api/types/inspection.ts
export interface InspectionPostcode {
  location_id: number;
  postcode: string;
}

export interface InspectionPostcodeResponse {
  success: {
    message: string;
  };
  data: InspectionPostcode[];
}
