import { apiClient } from "../../api/client";
import { FormData } from "./types";

export const RequestQuoteService = {
  getDraftForm: async (): Promise<FormData> => {
    const response = await apiClient.get<{ data: FormData }>(
      "/api/v2/mobile/sellers/lead-sell-forms/draft-form"
    );
    return response.data.data;
  },

  submitForm: async (formId: number, data: any) => {
    const response = await apiClient.put(
      `/api/v2/mobile/sellers/lead-sell-forms/${formId}/submit`,
      data
    );
    return response.data;
  },

  // 🔽 新增方法：支持 DropdownField 根据参数加载选项
  fetchOptions: async (
    url: string,
    params: Record<string, any> = {}
  ): Promise<any[]> => {
    const response = await apiClient.get<{ data: any[] }>(url, { params });
    return response.data.data;
  },
};
