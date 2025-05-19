// src/services/auth.ts
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';

// 配置参数
const config = {
  clientId: "98befbc0-782e-4eb3-a327-daf3e5949fa2",
  redirectUri: "app://sg.carro.agent.staging",
  authUrl: "https://cx-sso.carro.co",
  tokenUrl: "https://cx-api-sso.carro.co/api/oauth/token",
  logoutUrl: "https://stg-api.sso.carro.co/api/client/logout",
  scopes: ["*"],
};

// 生成随机字符串用于PKCE
const generateRandomString = async (length: number): Promise<string> => {
  const randomBytes = await Crypto.getRandomBytesAsync(length);
  return Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

// 获取授权码
export const loginWithCARRO = async (): Promise<{
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
}> => {
  try {
    // 生成PKCE参数
    const codeVerifier = await generateRandomString(32);
    const codeChallenge = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      codeVerifier
    );

    // 构建授权请求URL
    const authRequestOptions: AuthSession.AuthRequestConfig = {
      clientId: config.clientId,
      redirectUri: config.redirectUri,
      scopes: config.scopes,
      responseType: AuthSession.ResponseType.Code,
      codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
      codeChallenge,
      extraParams: {
        nonce: await generateRandomString(16),
      },
    };

    const authUrl = `${config.authUrl}?` +
      `client_id=${config.clientId}&` +
      `redirect_uri=${encodeURIComponent(config.redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(config.scopes.join(' '))}&` +
      `code_challenge=${codeChallenge}&` +
      `code_challenge_method=S256`;

    // 打开系统浏览器进行认证
    const result = await WebBrowser.openAuthSessionAsync(
      authUrl,
      config.redirectUri
    );

    if (result.type === 'success') {
      // 从回调URL中提取code
      const params = new URLSearchParams(result.url.split('?')[1]);
      const code = params.get('code');

      if (!code) throw new Error('Authorization code not found');

      // 用code交换token
      const tokenResponse = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: config.redirectUri,
          client_id: config.clientId,
          code_verifier: codeVerifier,
        }).toString(),
      });

      const tokens = await tokenResponse.json();
      return {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        idToken: tokens.id_token,
      };
    }

    throw new Error('Authentication cancelled');
  } catch (error) {
    console.error('SSO Login Error:', error);
    throw error;
  }
};

// 退出登录
export const logoutFromCARRO = async (token: string): Promise<void> => {
  try {
    await fetch(config.logoutUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
};