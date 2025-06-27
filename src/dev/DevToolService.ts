// src/dev/DevToolService.ts
import RNShake from "react-native-shake";
import { Alert, Platform } from "react-native";
import { NavigationContainerRef } from "@react-navigation/native";

// 可选导入 DevMenu（仅在 Dev Client 中可用）
let DevMenu: { show: () => void } | undefined;
try {
  DevMenu = require("expo-dev-menu");
} catch (e) {
  // 如果不是 Dev Client，会加载失败，不影响运行
  DevMenu = undefined;
}

class DevToolService {
  private navigationRef: NavigationContainerRef<any> | null = null;
  private shakeListener?: { remove: () => void };

  init(navigationRef: NavigationContainerRef<any>) {
    if (!__DEV__) return;

    this.navigationRef = navigationRef;

    this.shakeListener = RNShake.addListener(() => {
      this.showDevOptions();
    });

    console.log("[DevTool] 初始化成功 ✅（摇一摇开启调试菜单）");
  }

  cleanup() {
    this.shakeListener?.remove?.();
    this.shakeListener = undefined;
    console.log("[DevTool] 清理完成");
  }

  private showDevOptions() {
    if (!this.navigationRef?.isReady()) return;

    Alert.alert("🛠 开发者工具", "请选择调试功能", [
      {
        text: "📡 查看 NetworkLogger",
        onPress: () => this.navigationRef?.navigate("NetworkLogger"),
      },
      DevMenu && {
        text: "🛠 打开 Dev Menu",
        onPress: () => DevMenu?.show?.(),
      },
      {
        text: "❌ 取消",
        style: "cancel",
      },
    ].filter(Boolean) as any); // TypeScript 处理 undefined
  }
}

export const devToolService = new DevToolService();
