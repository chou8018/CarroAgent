import { EnvironmentType, EnvironmentConfig } from "./types";

// 获取当前环境变量，如果没有设置则报错（强制要求明确指定环境）
const getEnvironment = (): EnvironmentType => {
  const env = process.env.REACT_APP_ENV as EnvironmentType;
  if (!env) {
    throw new Error("REACT_APP_ENV environment variable is not set");
  }
  if (!["staging", "qa", "production"].includes(env)) {
    throw new Error(`Invalid environment: ${env}`);
  }
  return env;
};

const currentEnv = getEnvironment();

// 定义所有环境配置
const environments: Record<EnvironmentType, EnvironmentConfig> = {
  staging: {
    API_URL: "https://api.staging.example.com/v1",
    ENV_NAME: "staging",
    LOG_LEVEL: "debug",
    FEATURE_FLAGS: {
      experimentalFeature: true,
    },
  },
  qa: {
    API_URL: "https://api.qa.example.com/v1",
    ENV_NAME: "qa",
    LOG_LEVEL: "info",
    FEATURE_FLAGS: {
      experimentalFeature: true,
    },
  },
  production: {
    API_URL: "https://api.example.com/v1",
    ENV_NAME: "production",
    ANALYTICS_KEY: "prod-analytics-key-123",
    LOG_LEVEL: "warn",
    FEATURE_FLAGS: {
      experimentalFeature: false,
    },
  },
};

// 导出当前环境配置
const config: EnvironmentConfig = environments[currentEnv];

export default config;
