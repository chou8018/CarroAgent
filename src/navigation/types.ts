import { QuoteFormData } from "../components/RequestQuote/types";

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Request: undefined; // 新增
  Appointment: {
    carplateNo: string;
    formData?: QuoteFormData; // 如果传完整结构（推荐）
  };
};

export type MainTabParamList = {
  Home: undefined;
  Sell: undefined;
  Profile: undefined;
};
