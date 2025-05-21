// app.config.js
export default ({ config }) => ({
  ...config,
  extra: {
    // 使用 EXPO_PUBLIC_前缀（Expo官方推荐）
    REACT_APP_ENV: process.env.EXPO_PUBLIC_APP_ENV || "staging", // 与scripts变量名一致
    API_URLS: JSON.stringify({
      staging: "https://api.staging.example.com",
      qa: "https://api.qa.example.com",
      production: "https://api.example.com",
    }),
    // 直接暴露当前API_URL（推荐）
    CURRENT_API_URL: {
      staging: "https://api.staging.example.com",
      qa: "https://api.qa.example.com",
      production: "https://api.example.com",
    }[process.env.EXPO_PUBLIC_APP_ENV || "staging"],
  },
});
