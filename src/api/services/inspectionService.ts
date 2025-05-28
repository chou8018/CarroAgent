// src/api/services/inspection.ts
import { apiClient } from "../client";
import {
  InspectionPostcode,
  InspectionPostcodeResponse,
} from "../types/inspection"; // 假设已定义相关类型

export const InspectionService = {
  /**
   * 获取可用的检查点邮编列表
   * @returns 包含邮编列表的响应数据
   */
  getAvailablePostcodes: async (): Promise<InspectionPostcode[]> => {
    const response = await apiClient.get<InspectionPostcodeResponse>(
      "api/v2/mobile/config/inspection-postcodes"
    );
    return response.data.data; // ✅ 返回正确的 InspectionPostcode 数组
  },
};
