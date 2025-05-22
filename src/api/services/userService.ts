// src/api/services/user.ts
import { apiClient } from "../client";
import { User } from "../types/user"; // 假设已定义User类型

export const UserService = {
  /**
   * 获取当前用户信息
   * @returns 用户数据
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>("/mobile/users/current");
    return response.data;
  },
};
