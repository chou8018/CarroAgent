import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  ScrollView,
} from "react-native";
import type { SubPageData } from "./types";
import type { NavBarStatusItem } from "../../api/types/sellFormNavBar";
import { apiClient } from "../../api/client";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import RejectOfferModal from "../modals/RejectOfferModal";
import { RequestQuoteService } from "../../components/RequestQuote/services";
import SellItemCard from "./SellItemCard";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Appointment"
>;

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
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<SubPageData | null>(null);
  const navigation = useNavigation<NavigationProp>();

  const apiUrl = statusItems.find((s) => s.name === routeKey)?.url || "";

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<{ data: SubPageData[] }>(apiUrl);
      setData(res.data.data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ✅ 加入防抖机制，1秒内最多刷新一次
  const lastRefreshTime = useRef(0);
  const refreshDataOnce = () => {
    const now = Date.now();
    if (now - lastRefreshTime.current > 1000) {
      lastRefreshTime.current = now;
      fetchData();
    }
  };

  const handleRejectConfirm = async (targetPrice: string, remarks: string) => {
    try {
      if (!currentOffer?.id || !currentOffer?.lead_id) return;
      await RequestQuoteService.submitRejectOffer(
        currentOffer.id.toString(),
        targetPrice,
        remarks
      );
      fetchData();
    } catch (err) {
      console.error("Reject offer error:", err);
    } finally {
      setIsRejectModalVisible(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [routeKey]);

  if (loading && !refreshing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          alignItems: "center",
          paddingTop: 40,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
      >
        <Text style={{ fontSize: 18, color: "#666" }}>No Data</Text>
        <Text style={{ fontSize: 14, color: "#999" }}>Check back later.</Text>
      </ScrollView>
    );
  }

  return (
    <>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
        renderItem={({ item }) => (
          <SellItemCard
            item={item}
            routeKey={routeKey}
            onReject={() => {
              setCurrentOffer(item);
              setIsRejectModalVisible(true);
            }}
            onAccept={() =>
              navigation.navigate("AcceptPrice", {
                offer: item,
              })
            }
            onHandover={() =>
              navigation.navigate("Appointment", {
                carplateNo: item.car_plate,
                offer: item,
              })
            }
            onPayment={() =>
              navigation.navigate("Payment", {
                item,
              })
            }
            onCountdownComplete={refreshDataOnce} // 👈 传入刷新函数
          />
        )}
        contentContainerStyle={{ padding: 16 }}
      />
      <RejectOfferModal
        visible={isRejectModalVisible}
        onCancel={() => setIsRejectModalVisible(false)}
        onConfirm={handleRejectConfirm}
        currentOffer={currentOffer}
      />
    </>
  );
};

export default SubPage;

// 可用于 NestedTabView 的 SceneMap 工厂
export const createSubScene = (
  routeKey: string,
  statusItems: NavBarStatusItem[]
): React.FC => {
  return () => <SubPage routeKey={routeKey} statusItems={statusItems} />;
};
