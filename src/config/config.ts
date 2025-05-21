// src/config.ts
import Constants from "expo-constants";

// 类型定义
type Environment = "staging" | "qa" | "production";

interface AppConfig {
  version: string;
  build: string;
  env: Environment;
  apiUrl: string;
  // 可以添加其他全局配置项
  appId: string;
}

// 默认API URLs
const DEFAULT_API_URLS = {
  staging: "https://cx-wsapi.getcarsstaging.com/",
  qa: "https://ws-api-eks.getcars.dev/",
  production: "https://captain-api.carro.sg/",
};

// 版本和构建配置
const VERSION_CONFIGS: Record<
  Environment,
  Omit<AppConfig, "env" | "apiUrl">
> = {
  staging: {
    version: "v1.0.0",
    build: "1",
    appId: "com.mytukar.wholesaleStaging",
  },
  qa: {
    version: "v1.0.0",
    build: "1",
    appId: "com.mytukar.wholesaleQA",
  },
  production: {
    version: "v1.0.0",
    build: "1",
    appId: "com.mytukar.wholesale",
  },
};

// 获取环境配置
const getEnvironmentConfig = (): Environment => {
  // 1. 从 expo extra 配置获取
  const extra = Constants.expoConfig?.extra || {};

  // 2. 从 process.env 获取 (适用于非Expo项目)
  const processEnv = process.env.REACT_APP_ENV;

  // 3. 确定当前环境 (默认 staging)
  const env = (
    extra.REACT_APP_ENV ||
    processEnv ||
    "staging"
  ).toLowerCase() as Environment;

  return env;
};

// 获取API URLs配置
const getApiUrls = (): Record<Environment, string> => {
  const extra = Constants.expoConfig?.extra || {};

  try {
    if (typeof extra.API_URLS === "string") {
      return JSON.parse(extra.API_URLS);
    }
    if (typeof extra.API_URLS === "object") {
      return extra.API_URLS;
    }
  } catch (e) {
    console.warn("Failed to parse API_URLS, using defaults", e);
  }

  return DEFAULT_API_URLS;
};

// 构建完整配置
const buildConfig = (): AppConfig => {
  const env = getEnvironmentConfig();
  const apiUrls = getApiUrls();

  return {
    ...VERSION_CONFIGS[env],
    env,
    apiUrl: apiUrls[env] || apiUrls.staging,
  };
};

// 导出配置实例
export const config = buildConfig();

// 导出常用环境检查方法
export const isStaging = () => config.env === "staging";
export const isQA = () => config.env === "qa";
export const isProduction = () => config.env === "production";

// 导出类型
export type { Environment, AppConfig };
