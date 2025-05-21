// app.config.js
export default ({ config }) => ({
  ...config,
  extra: {
    // 使用 EXPO_PUBLIC_前缀（Expo官方推荐）
    REACT_APP_ENV: process.env.EXPO_PUBLIC_APP_ENV || "staging", // 与scripts变量名一致
    API_URLS: JSON.stringify({
      staging: "https://cx-wsapi.getcarsstaging.com/",
      qa: "https://ws-api-eks.getcars.dev/",
      production: "https://captain-api.carro.sg/",
    }),
    // 直接暴露当前API_URL（推荐）
    CURRENT_API_URL: {
      staging: "https://cx-wsapi.getcarsstaging.com/",
      qa: "https://ws-api-eks.getcars.dev/",
      production: "https://captain-api.carro.sg/",
    }[process.env.EXPO_PUBLIC_APP_ENV || "staging"],
  },
});
