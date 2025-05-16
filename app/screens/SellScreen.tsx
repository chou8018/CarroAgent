import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";

// 子页面组件
const SubPage = ({ routeKey }: { routeKey: string }) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.subPageContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#FF6B00"]}
        />
      }
    >
      <Text style={styles.noDataText}>No Data</Text>
      <Text style={styles.hintText}>Check back later.</Text>
    </ScrollView>
  );
};

// 创建子场景
const createSubScene = (routeKey: string) => () =>
  <SubPage routeKey={routeKey} />;

// 自定义TabBar组件
const CustomTabBar = (props: any) => (
  <TabBar
    {...props}
    indicatorStyle={styles.tabIndicator}
    style={styles.tabBar}
    labelStyle={styles.tabLabel}
    activeColor="#FF6B00"
    inactiveColor="#666"
  />
);

// 嵌套的TabView组件
const NestedTabView = ({
  routes,
}: {
  routes: { key: string; title: string }[];
}) => {
  const [subIndex, setSubIndex] = useState(0);

  const renderScene = SceneMap(
    routes.reduce((acc, route) => {
      acc[route.key] = createSubScene(route.key);
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

// 主组件
const SellScreen: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "myRequests", title: "My Requests" },
    { key: "myTransactions", title: "My Transactions" },
  ]);

  const renderScene = SceneMap({
    myRequests: () => (
      <NestedTabView
        routes={[
          { key: "inspection", title: "Inspection" },
          { key: "offers", title: "Offers" },
          { key: "biddings", title: "Biddings" },
          { key: "endedRequest", title: "Ended Request" },
        ]}
      />
    ),
    myTransactions: () => (
      <NestedTabView
        routes={[
          { key: "processing", title: "Processing" },
          { key: "records", title: "Records" },
        ]}
      />
    ),
  });

  return (
    <View style={styles.container}>
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

// 样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  tabBar: {
    backgroundColor: "white",
    elevation: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  tabLabel: {
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "capitalize",
    margin: 0,
  },
  tabIndicator: {
    backgroundColor: "#FF6B00",
    height: 3,
  },
  subPageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  noDataText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  hintText: {
    fontSize: 14,
    color: "#999",
  },
});

export default SellScreen;
