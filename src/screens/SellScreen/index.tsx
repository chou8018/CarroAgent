import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Dimensions } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { SellFormNavBarService } from "../../api/services/sellFormNavBarService";
import { CustomTabBar } from "./CustomTabBar";
import NestedTabView from "./NestedTabView";
import type { NavBarItem } from "../../api/types/sellFormNavBar";

const SellScreen: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [navData, setNavData] = useState<NavBarItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SellFormNavBarService.getSellFormNavBar()
      .then(setNavData)
      .catch((err) => console.error("Fetch nav error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  const routes = navData.map((item) => ({
    key: item.name,
    title: item.display_name,
  }));

  const renderScene = SceneMap(
    navData.reduce((acc, item) => {
      acc[item.name] = () => (
        <NestedTabView
          routes={item.status.map((s) => ({
            key: s.name,
            title: s.display_name,
          }))}
          statusItems={item.status}
        />
      );
      return acc;
    }, {} as Record<string, React.FC>)
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => <CustomTabBar {...props} />}
        initialLayout={{ width: Dimensions.get("window").width }}
      />
    </View>
  );
};

export default SellScreen;
