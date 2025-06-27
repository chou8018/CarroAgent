// src/api/types/appointment.ts

// 基本响应结构
export interface BaseResponse {
  success: {
    message: string;
  };
}

// 邮编响应
export interface PostcodeResponse extends BaseResponse {
  data: Postcode[];
}

export interface Postcode {
  location_id: number;
  postcode: string;
}

// 位置响应
export interface LocationResponse extends BaseResponse {
  data: InspectionLocation[];
}

export interface InspectionLocation {
  title: string;
  value: number;
}

// 可用日期响应
export interface AvailableDatesResponse extends BaseResponse {
  data: {
    config_appointment_booking: AvailableDate[];
  };
}

export interface AvailableDate {
  date: string; // YYYY-MM-DD
  is_holiday: boolean;
  exists_slot: boolean;
}

// 时间段响应
export interface TimeSlotsResponse extends BaseResponse {
  data: {
    [date: string]: TimeSlot[];
  };
}

export interface TimeSlot {
  has_inspection: boolean;
  time: string; // e.g. "8:00 AM"
  slots_left: number;
  title: string;
  date: string;
  slots_set: number;
  value: string; // e.g. "08:00"
}
