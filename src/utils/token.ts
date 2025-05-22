// src/utils/token.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "access_token";

export const setAccessToken = async (
  token: string | null | undefined
): Promise<void> => {
  if (typeof token !== "string") {
    console.warn("setAccessToken: invalid token, skipping storage");
    return;
  }
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getAccessToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
};

export const removeAccessToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log("AsyncStorage 已清空");
  } catch (e: any) {
    const errorText = e?.message || e?.toString?.() || "";
    if (
      errorText.includes("No such file or directory") ||
      errorText.includes("couldn’t be removed")
    ) {
      console.warn("Storage directory already missing, considered cleared.");
    } else {
      console.error("清空 AsyncStorage 失败:", e);
    }
  }
};
