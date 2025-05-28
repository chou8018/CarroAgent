// src/api/services/inspection.ts
import { apiClient } from "../client";
import {
  InspectionLocation,
  LocationResponse,
  Postcode,
  PostcodeResponse,
} from "../types/appointment"; // 假设已定义相关类型

export const AppointmentService = {
  /**
   * 获取可用的检查点邮编列表
   * @returns 包含邮编列表的响应数据
   */
  getAvailablePostcodes: async (): Promise<Postcode[]> => {
    const response = await apiClient.get<PostcodeResponse>(
      "api/v2/mobile/config/inspection-postcodes"
    );
    return response.data.data; // ✅ 返回正确的 InspectionPostcode 数组
  },

  getAvailableLocations: async (): Promise<InspectionLocation[]> => {
    const response = await apiClient.get<LocationResponse>(
      "api/v2/mobile/config/non-partnership-locations"
    );
    return response.data.data;
  },
};
