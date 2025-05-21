// src/utils/env.ts
import Constants from "expo-constants";

// 类型定义
type EnvType = "staging" | "qa" | "production";

// 安全获取环境变量
export const getEnv = (): {
  env: EnvType;
  apiUrl: string;
} => {
  // 1. 先从 extra 获取
  const extra = Constants.expoConfig?.extra || {};

  // 2. 解析 API_URLS
  let apiUrls = {
    staging: "https://api.staging.example.com",
    qa: "https://api.qa.example.com",
    production: "https://api.example.com",
  };

  try {
    if (typeof extra.API_URLS === "string") {
      apiUrls = JSON.parse(extra.API_URLS);
    }
  } catch (e) {}

  // 3. 确定当前环境
  const env = (extra.REACT_APP_ENV || "staging").toLowerCase() as EnvType;

  // 4. 返回最终值
  return {
    env,
    apiUrl: apiUrls[env] || apiUrls.staging,
  };
};

// 直接导出常用变量
export const { env, apiUrl } = getEnv();
