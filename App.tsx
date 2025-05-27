import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./src/screens/LoginScreen";
import MainTabNavigator from "./src/navigation/MainTabNavigator";
import GlobalLoading from "./src/components/GlobalLoading";
import { config } from "./src/config/config";
import { RootStackParamList } from "./src/navigation/types";
import { UserService } from "./src/api/services/userService";
import { useUserStore } from "./src/store/userStore";
import RequestQuoteScreen from "./src/components/RequestQuote";
import AppointmentScreen from "./src/screens/AppointmentScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (token) {
          // 你也可以在这里验证 token 是否有效，或获取用户信息
          const user = await UserService.getCurrentUser();
          useUserStore.getState().setUser(user);
          setInitialRoute("Main");
        } else {
          setInitialRoute("Login");
        }
      } catch (e) {
        console.log("Error checking login status", e);
        setInitialRoute("Login");
      }
    };

    checkLogin();
  }, []);

  if (!initialRoute) {
    return null; // 或者返回 <SplashScreen />、<ActivityIndicator />
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Request"
            component={RequestQuoteScreen}
            options={{
              title: "Request A Quote",
              presentation: "card", // 这里就是“present”形式的关键
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="Appointment"
            component={AppointmentScreen}
            options={{
              title: "Appointment",
              presentation: "card",
              headerShown: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <GlobalLoading />
    </>
  );
}
