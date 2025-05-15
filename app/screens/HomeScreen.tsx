import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Swiper from "react-native-swiper";

// 定义导航类型
type RootStackParamList = {
  Request: undefined;
  Insurance: undefined;
};

type MainTabParamList = {
  Home: undefined;
  Sell: undefined;
  Profile: undefined;
};

type HomeScreenNavigationProp = BottomTabNavigationProp<
  MainTabParamList,
  "Home"
> &
  NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const screenWidth = Dimensions.get("window").width;

  // 广告数据
  const ads = [
    { id: 1, title: "Special Offer 1", color: "#FF6B00" },
    { id: 2, title: "Limited Time Deal", color: "#4CAF50" },
    { id: 3, title: "New Arrivals", color: "#2196F3" },
  ];

  // 功能项配置
  const features = [
    {
      id: 1,
      name: "Request",
      onPress: () => navigation.navigate("Request"),
    },
    {
      id: 2,
      name: "Calculator",
      onPress: () => navigation.navigate("Sell"),
    },
    {
      id: 3,
      name: "Offers",
      onPress: () => navigation.navigate("Sell"),
    },
    {
      id: 4,
      name: "Biddings",
      onPress: () => navigation.navigate("Sell"),
    },
    {
      id: 5,
      name: "Records",
      onPress: () => navigation.navigate("Sell"),
    },
    {
      id: 6,
      name: "Insurance",
      onPress: () => navigation.navigate("Insurance"),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* 用户信息区域 */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.companyName}>CARRO® WHOLESALE</Text>
        <Text style={styles.userName}>Chen Jun</Text>
        <Text style={styles.userRole}>Superadmin</Text>
      </View>

      {/* 广告轮播 - 使用 Swiper 替换 Carousel */}
      <View style={[styles.carouselContainer, { height: 160 }]}>
        <Swiper
          autoplay
          autoplayTimeout={3}
          showsPagination={true}
          dotColor="rgba(255,255,255,0.5)"
          activeDotColor="#FFFFFF"
        >
          {ads.map((ad) => (
            <View
              key={ad.id}
              style={[styles.adContainer, { backgroundColor: ad.color }]}
            >
              <Text style={styles.adText}>{ad.title}</Text>
            </View>
          ))}
        </Swiper>
      </View>

      {/* Sell your cars 部分 */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Sell your cars</Text>
        <View style={styles.featuresGrid}>
          {features.slice(0, 6).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.featureItem}
              onPress={item.onPress}
            >
              <Text style={styles.featureText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  userInfoContainer: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
  },
  companyName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    color: "#444",
    marginBottom: 2,
  },
  userRole: {
    fontSize: 14,
    color: "#666",
  },
  carouselContainer: {
    marginVertical: 16,
  },
  adContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginHorizontal: 16,
  },
  adText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureItem: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});

export default HomeScreen;
