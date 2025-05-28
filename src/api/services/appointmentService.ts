// src/api/services/inspection.ts
import { apiClient } from "../client";
import {
  InspectionLocation,
  LocationResponse,
  Postcode,
  PostcodeResponse,
  AvailableDatesResponse,
  TimeSlotsResponse,
  AvailableDate,
} from "../types/appointment";

export const AppointmentService = {
  /**
   * 获取可用的检查点邮编列表
   */
  getAvailablePostcodes: async (): Promise<Postcode[]> => {
    const response = await apiClient.get<PostcodeResponse>(
      "api/v2/mobile/config/inspection-postcodes"
    );
    return response.data.data;
  },

  /**
   * 获取非合作网点的位置数据
   */
  getAvailableLocations: async (): Promise<InspectionLocation[]> => {
    const response = await apiClient.get<LocationResponse>(
      "api/v2/mobile/config/non-partnership-locations"
    );
    return response.data.data;
  },

  /**
   * 获取可用日期
   * @param params - 包含 locationId, postcode, type（默认 prebooking）
   */
  getAvailableDates: async ({
    locationId,
    postcode,
    type = "prebooking",
  }: {
    locationId: number;
    postcode: string;
    type?: string;
  }): Promise<AvailableDate[]> => {
    const params = {
      "types[0][name]": "config_appointment_booking",
      "types[0][filter]": "agent",
      "types[0][filter2]": locationId.toString(),
      "types[0][filter3]": type,
      // 如需传递 postcode 可启用此行
      // "inspection_postcode": postcode,
    };

    const response = await apiClient.get<AvailableDatesResponse>(
      "api/v1/config/options",
      { params }
    );

    return response.data.data.config_appointment_booking;
  },

  /**
   * 获取时间段
   * @param params - 包含 locationId, postcode, date（YYYY-MM-DD）
   */
  getTimeSlots: async ({
    locationId,
    postcode = "",
    date,
  }: {
    locationId: number;
    postcode?: string;
    date: string;
  }): Promise<TimeSlotsResponse["data"]> => {
    const response = await apiClient.get<TimeSlotsResponse>(
      "api/v2/mobile/time-slots/range/prebooking",
      {
        params: {
          location_id: locationId,
          inspection_postcode: postcode,
          start_time: date,
          end_time: date,
          show_all: true,
        },
      }
    );
    return response.data.data;
  },
};
