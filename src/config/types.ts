export type EnvironmentType = "staging" | "qa" | "production";

export interface EnvironmentConfig {
  API_URL: string;
  ENV_NAME: EnvironmentType;
  // 其他环境特定变量
  ANALYTICS_KEY?: string;
  LOG_LEVEL?: "debug" | "info" | "warn" | "error";
  FEATURE_FLAGS?: {
    experimentalFeature?: boolean;
  };
}
