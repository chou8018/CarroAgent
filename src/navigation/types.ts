import { QuoteFormData } from "../components/RequestQuote/types";
import { NavigatorScreenParams } from "@react-navigation/native";
import type { SubPageData } from "../screens/SellScreen";

export type RootStackParamList = {
  Login: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  Request: undefined; // 新增
  Appointment: {
    carplateNo: string;
    formData?: QuoteFormData; // 如果传完整结构（推荐）
  };
  Payment: { item: SubPageData };
};

export type MainTabParamList = {
  Home: undefined;
  Sell: undefined;
  Profile: undefined;
};
