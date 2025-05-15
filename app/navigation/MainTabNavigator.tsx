import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "./types";
import HomeScreen from "../screens/HomeScreen";
import SellScreen from "../screens/SellScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Image, View } from "react-native";

const Tab = createBottomTabNavigator<MainTabParamList>();

const getIcon = (routeName: string, focused: boolean) => {
  switch (routeName) {
    case "Home":
      return focused
        ? require("../assets/tab_home.png")
        : require("../assets/tab_home_outline.png");
    case "Sell":
      return focused
        ? require("../assets/tab_sell.png")
        : require("../assets/tab_sell_outline.png");
    case "Profile":
      return focused
        ? require("../assets/tab_profile.png")
        : require("../assets/tab_profile_outline.png");
    default:
      return null;
  }
};

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconSource = getIcon(route.name, focused);
          return (
            <Image
              source={iconSource}
              style={{
                width: 28,
                height: 28,
                tintColor: color, // 可选：用于给 PNG 着色
                resizeMode: "contain",
              }}
            />
          );
        },
        tabBarActiveTintColor: "#FF6B00",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Sell" component={SellScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
