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
    offer?: SubPageData;
  };
  Payment: { item: SubPageData };
  AcceptPrice: {
    offer: SubPageData; // 传递完整的报价数据
  };
};

export type MainTabParamList = {
  Home: undefined;
  Sell: undefined;
  Profile: undefined;
};
