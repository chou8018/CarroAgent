import { apiClient } from "../client";
import { SellFormNavBarResponse } from "../types/sellFormNavBar";

export const SellFormNavBarService = {
  /**
   * 获取销售表单导航栏配置
   * @returns 导航栏配置数据
   */
  getSellFormNavBar: async (): Promise<SellFormNavBarResponse["data"]> => {
    const response = await apiClient.get<SellFormNavBarResponse>(
      "api/v2/mobile/sellers/config/sell-form-nav-bar"
    );
    return response.data.data; // Returns the array of NavBarItem
  },
};
