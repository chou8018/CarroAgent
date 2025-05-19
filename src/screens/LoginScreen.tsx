import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { loginWithCARRO } from "../services/auth";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";

// 在组件中使用
type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const handleLogin = async () => {
    try {
      const authResult = await loginWithCARRO();
      navigation.replace("Main");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleSignUp = () => {
    // 跳转到注册页面
    // navigation.navigate("SignUp");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* CARRO Logo */}
      <Image
        source={require("../assets/carro_logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* 登录按钮（带背景图） */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Image
          source={require("../assets/sso_login_button.png")}
          style={styles.buttonBackground}
          resizeMode="stretch"
        />
      </TouchableOpacity>

      {/* 注册链接 */}
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpText}>Sign up</Text>
      </TouchableOpacity>

      {/* 版本信息 */}
      <Text style={styles.versionText}>v2.4.2 build 133 staging-cx</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    // alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
    // alignSelf: "center",
  },
  logo: {
    width: 180,
    height: 60,
    marginBottom: 80,
    alignSelf: "center",
  },
  loginButton: {
    width: "85%",
    height: 45,
    borderRadius: 8,
    overflow: "hidden",
    bottom: 140,
    alignSelf: "center",
    alignItems: "center",
    position: "absolute",
  },
  buttonBackground: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  signUpButton: {
    bottom: 100,
    position: "absolute",
    alignSelf: "center",
  },
  signUpText: {
    color: "#1a73e8",
    fontSize: 16,
    fontWeight: "600",
  },
  versionText: {
    width: "85%",

    position: "absolute",
    bottom: 40, // 距离屏幕底部40单位
    // right: 30, // 距离屏幕右侧30单位
    color: "#666666", // 深灰色文字
    fontSize: 12, // 小字号
    includeFontPadding: false, // 消除文字额外内边距
    textAlign: "right", // 文字右对齐（多行时有用）
    // backgroundColor: "#1a73e8",
    alignSelf: "center",
  },
});

export default LoginScreen;
