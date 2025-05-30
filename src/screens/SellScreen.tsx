import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { SellFormNavBarService } from "../api/services/sellFormNavBarService";
import type { NavBarItem, NavBarStatusItem } from "../api/types/sellFormNavBar";
import { apiClient } from "../api/client";

// 自定义TabBar组件（确保这在使用前定义）
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

// 定义子页面数据接口
interface SubPageData {
  id: number; // 从 string 改为 number，符合实际数据
  title: string;
  target_price: string | null;
  date_value: string;
  car_plate: string;
  mileage: string;
  interchange_car_plate: "yes" | "no";
  car_model: string | null;
  manufacture_year: string;
  year_of_manufacture: string | null;
  lead_id: number;
  date_label: string;
  location?: string; // 原接口有，后端数据未包含
  tip?: {
    text_color: string;
    description: string;
  };
  ticket_id: number;
  status_display_name: string;
  car_make: string | null;
  payment_document_urls: string[];

  // ✅ 新增字段
  discounts?: any[]; // 若有结构可进一步定义
  has_handover_appointment: boolean;
  has_payment_detail: boolean;
  owner_name: string;
  owner_phone_no: string;
  price_label: string;
  price_value: string | null;
  vouchers?: any[]; // 若有结构可进一步定义

  status: {
    name: string;
  };
}

// 子页面组件
const SubPage = ({
  routeKey,
  statusItems,
}: {
  routeKey: string;
  statusItems: NavBarStatusItem[];
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SubPageData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 找到当前routeKey对应的statusItem
  const currentStatusItem = statusItems.find((item) => item.name === routeKey);
  const apiUrl = currentStatusItem?.url || "";

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!apiUrl) {
        throw new Error("No API endpoint available");
      }
      console.log("apiUrl:", apiUrl);
      const response = await apiClient.get<{ data: SubPageData[] }>(apiUrl);
      console.log("✅ SubPageData:", response.data.data);
      setData(response.data.data);
    } catch (err) {
      // 使用类型保护处理
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("API Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [routeKey]);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.subPageContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (data.length === 0) {
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
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#FF6B00"]}
        />
      }
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <Text
            style={styles.itemTitle}
          >{`${item.manufacture_year} ${item.car_make} ${item.car_model}`}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoText}>{item.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoText}>{item.date_value}</Text>
          </View>

          {item.tip?.description ? (
            <View style={styles.statusBox}>
              <Text style={[styles.statusText, { color: item.tip.text_color }]}>
                {item.tip.description}
              </Text>
            </View>
          ) : null}
        </View>
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
};

// 创建子场景（现在需要传递statusItems）
const createSubScene =
  (routeKey: string, statusItems: NavBarStatusItem[]) => () =>
    <SubPage routeKey={routeKey} statusItems={statusItems} />;

// ...（之前的CustomTabBar和NestedTabView组件保持不变）

// 主组件
const SellScreen: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [navData, setNavData] = useState<NavBarItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNavBarData = async () => {
      try {
        const response = await SellFormNavBarService.getSellFormNavBar();
        setNavData(response);
      } catch (error) {
        console.error("Failed to fetch nav bar data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNavBarData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  // 构建主Tab路由和场景
  const routes = navData.map((item) => ({
    key: item.name,
    title: item.display_name,
  }));

  const renderScene = SceneMap(
    navData.reduce((acc, item) => {
      acc[item.name] = () => (
        <NestedTabView
          routes={item.status.map((status) => ({
            key: status.name,
            title: status.display_name,
          }))}
          statusItems={item.status} // 传递statusItems给NestedTabView
        />
      );
      return acc;
    }, {} as Record<string, React.FC>)
  );

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

// 修改NestedTabView以接收statusItems
const NestedTabView = ({
  routes,
  statusItems,
}: {
  routes: { key: string; title: string }[];
  statusItems: NavBarStatusItem[];
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  // 添加缺失的样式
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
  itemContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  infoLabel: {
    fontWeight: "500",
    color: "#666",
    width: 80,
  },
  infoText: {
    color: "#333",
    flex: 1,
  },
  statusBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#FFF3E8",
    borderRadius: 8,
  },
  statusText: {
    color: "#FF6B00",
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default SellScreen;
