// app.config.staging.js
import baseConfig from "./app.config.base";

export default {
  ...baseConfig,
  extra: {
    ...baseConfig.extra,
    REACT_APP_ENV: "staging",
  },
};
