import * as AuthSession from "expo-auth-session";
import * as Crypto from "expo-crypto";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";

// 临时缓存
let _codeVerifier: string;

// 所有环境配置
const ENV_CONFIG = {
  staging: {
    clientId: "98befbc0-782e-4eb3-a327-daf3e5949fa2",
    redirectUri: "app://sg.carro.agent.staging",
    authUrl: "https://cx-sso.carro.co",
    tokenUrl: "https://cx-api-sso.carro.co/api/oauth/token",
    logoutUrl: "https://stg-api.sso.carro.co/api/client/logout",
  },
  qa: {
    clientId: "9d2ff4df-d699-4915-a279-dae2a13f0496",
    redirectUri: "app://sg.carro.agent.qa",
    authUrl: "https://uat-sso.carro.co",
    tokenUrl: "https://uat-api.sso.carro.co/api/oauth/token",
    logoutUrl: "https://uat-api.sso.carro.co/api/client/logout",
  },
  production: {
    clientId: "9d3250e2-6c2b-48b7-8543-d8e93fa4490b",
    redirectUri: "app://sg.carro.agent",
    authUrl: "https://sso.carro.co",
    tokenUrl: "https://api.sso.carro.co/api/oauth/token",
    logoutUrl: "https://api.sso.carro.co/api/client/logout",
  },
};

// 获取当前环境配置
const ENV = (Constants.expoConfig?.extra?.REACT_APP_ENV ||
  "staging") as keyof typeof ENV_CONFIG;
const config = ENV_CONFIG[ENV];

/** 生成随机字符串用于 PKCE */
const generateRandomString = async (length: number): Promise<string> => {
  const randomBytes = await Crypto.getRandomBytesAsync(length);
  return Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

/** Base64URL 编码 */
const base64UrlEncode = (str: string): string => {
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export const loginWithCARRO = async (): Promise<{
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
}> => {
  try {
    if (!_codeVerifier) {
      _codeVerifier = await generateRandomString(64);
    }

    const rawChallenge = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      _codeVerifier,
      { encoding: Crypto.CryptoEncoding.BASE64 }
    );
    const codeChallenge = base64UrlEncode(rawChallenge);

    const authUrl =
      `${config.authUrl}?` +
      `client_id=${config.clientId}&` +
      `redirect_uri=${encodeURIComponent(config.redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent("*")}&` +
      `code_challenge=${codeChallenge}&` +
      `code_challenge_method=S256`;

    const result = await WebBrowser.openAuthSessionAsync(
      authUrl,
      config.redirectUri
    );

    if (result.type === "success") {
      const params = new URLSearchParams(result.url.split("?")[1]);
      const code = params.get("code");
      if (!code) throw new Error("Authorization code not found");

      const tokenResponse = await fetch(config.tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: config.clientId,
          code_verifier: _codeVerifier,
          redirect_uri: config.redirectUri,
          code,
          grant_type: "authorization_code",
        }),
      });

      const json = await tokenResponse.json();

      _codeVerifier = "";

      if (!json.success || !json.data?.access_token) {
        throw new Error(`Token exchange failed: ${JSON.stringify(json)}`);
      }

      return {
        accessToken: json.data.access_token,
        refreshToken: json.data.refresh_token,
        idToken: json.data.id_token,
      };
    }

    throw new Error("Authentication cancelled");
  } catch (error) {
    console.error("SSO Login Error:", error);
    throw error;
  }
};

export const logoutFromCARRO = async (token: string): Promise<void> => {
  try {
    await fetch(config.logoutUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};
