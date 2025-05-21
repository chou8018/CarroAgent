import { EnvironmentConfig } from "./types";

export const validateEnvironment = (config: EnvironmentConfig) => {
  // 确保API URL以https开头（生产环境必须）
  if (config.ENV_NAME === "production" && !config.API_URL.startsWith("https")) {
    throw new Error("Production API must use HTTPS");
  }

  // 确保生产环境有分析密钥
  if (config.ENV_NAME === "production" && !config.ANALYTICS_KEY) {
    throw new Error("Analytics key is required in production");
  }

  // 公共验证规则
  if (!config.API_URL) {
    throw new Error("API_URL is required in all environments");
  }
};

// 在应用入口调用（如App.tsx）
// validateEnvironment(config);
