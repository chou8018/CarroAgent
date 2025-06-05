import { AxiosProgressEvent } from "axios";
import * as FileSystem from "expo-file-system";
import { apiClient } from "../../api/client";
import { QuoteFormData } from "./types";

// 根据文件名后缀获取 MIME 类型
function getMimeType(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "pdf":
      return "application/pdf";
    case "heic":
      return "image/heic";
    default:
      return "application/octet-stream";
  }
}

export const RequestQuoteService = {
  // 获取payment表单
  getAcceptPriceForm: async (): Promise<QuoteFormData> => {
    const response = await apiClient.get<{ data: QuoteFormData }>(
      `/api/v2/mobile/sellers/config/lead-payment-form`
    );
    return response.data.data;
  },

  // 获取payment表单
  getPaymentForm: async (lead_id: string): Promise<QuoteFormData> => {
    const response = await apiClient.get<{ data: QuoteFormData }>(
      `/api/v2/mobile/sellers/lead-sell-forms/${lead_id}/payment-detail-form`
    );
    return response.data.data;
  },

  // 获取草稿表单
  getDraftForm: async (): Promise<QuoteFormData> => {
    const response = await apiClient.get<{ data: QuoteFormData }>(
      "/api/v2/mobile/sellers/lead-sell-forms/draft-form"
    );
    return response.data.data;
  },

  // 提交表单
  submitForm: async (url: string, data: any) => {
    const response = await apiClient.put(url, data);
    return response.data;
  },

  // 获取下拉选项
  fetchOptions: async (
    url: string,
    params: Record<string, any> = {}
  ): Promise<any[]> => {
    const response = await apiClient.get<{ data: any[] }>(url, { params });
    return response.data.data;
  },

  // 上传文件（Base64 JSON 格式，带 data:image/jpeg;base64,... 前缀）
  uploadFile: async (
    uri: string,
    url: string,
    method: "POST" | "PUT" | "DELETE" = "POST",
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
    extraFields: Record<string, any> = {}
  ) => {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileName = uri.split("/").pop() || "file.jpg";
    const mimeType = getMimeType(fileName);

    const payload = {
      file_item_name: extraFields.file_item_name,
      item_id: extraFields.item_id,
      collection: extraFields.collection,
      file: `data:${mimeType};base64,${base64}`,
    };

    const config = { onUploadProgress };

    switch (method) {
      case "POST":
        return (await apiClient.post(url, payload, config)).data;
      case "PUT":
        return (await apiClient.put(url, payload, config)).data;
      case "DELETE":
        // DELETE 请求不支持带请求体，去掉 payload
        return (await apiClient.delete(url, config)).data;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  },

  // 删除上传的文件
  deleteFile: async (
    deleteConfig: {
      url: string;
      method?: "DELETE" | "POST" | "PUT";
      collection?: string;
    },
    fileId: string
  ) => {
    if (!fileId || !deleteConfig?.url) {
      throw new Error("Missing fileId or delete URL");
    }

    const url = deleteConfig.url.replace("{file_id}", fileId);
    let response;

    switch ((deleteConfig.method || "DELETE").toUpperCase()) {
      case "POST":
        response = await apiClient.post(url, { id: fileId });
        break;
      case "PUT":
        response = await apiClient.put(url, { id: fileId });
        break;
      case "DELETE":
      default:
        response = await apiClient.delete(url);
        break;
    }

    console.log("删除图片成功:", fileId);
    return response.data;
  },
};
