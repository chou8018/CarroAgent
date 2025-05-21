// app.config.js
export default {
  expo: {
    // ...其他配置保持不变
    extra: {
      // 硬编码默认值，确保运行时一定有值
      REACT_APP_ENV: "staging",
      API_URLS: JSON.stringify({
        staging: "https://api.staging.example.com",
        qa: "https://api.qa.example.com",
        production: "https://api.example.com",
      }),
    },
  },
};
