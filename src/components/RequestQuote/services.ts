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
};
