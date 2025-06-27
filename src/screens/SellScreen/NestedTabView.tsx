import React, { useState } from "react";
import { Dimensions } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { createSubScene } from "./SubPage";
import type { NavBarStatusItem } from "../../api/types/sellFormNavBar";
import { CustomTabBar } from "./CustomTabBar";

interface NestedTabViewProps {
  routes: { key: string; title: string }[];
  statusItems: NavBarStatusItem[];
}

const NestedTabView: React.FC<NestedTabViewProps> = ({
  routes,
  statusItems,
}) => {
  const [subIndex, setSubIndex] = useState(0);

  const renderScene = SceneMap(
    routes.reduce((acc, route) => {
      acc[route.key] = createSubScene(route.key, statusItems);
      return acc;
    }, {} as Record<string, React.FC>)
  );

  return (
    <TabView
      navigationState={{ index: subIndex, routes }}
      renderScene={renderScene}
      onIndexChange={setSubIndex}
      renderTabBar={(props) => <CustomTabBar {...props} />}
      initialLayout={{ width: Dimensions.get("window").width }}
    />
  );
};

export default NestedTabView;
