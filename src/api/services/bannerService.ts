import { apiClient } from "../client";
import { Banner, BannerResponse } from "../types/banners";

export const BannerService = {
  /**
   * 获取banners
   * @returns banners
   */
  getBanners: async (): Promise<Banner[]> => {
    const response = await apiClient.get<BannerResponse>(
      "api/v1/mobile/banners?apps=wholesale-app"
    );
    return response.data.data.banners;
  },
};
