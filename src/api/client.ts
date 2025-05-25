// src/api/client.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosHeaders,
  RawAxiosRequestHeaders,
} from "axios";
import { config as appConfig } from "../config/config";
import { getAccessToken } from "../utils/token";

// 类型扩展
type CustomResponse<T = any> = AxiosResponse<T> & {
  message?: string;
};

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: appConfig.apiUrl,
      timeout: 15000,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      } as RawAxiosRequestHeaders, // 明确类型声明
    });

    this.setupInterceptors();
  }

  private async getAuthHeader(): Promise<Record<string, string>> {
    const token = await getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      async (config) => {
        const authHeader = await this.getAuthHeader();

        // 正确的headers合并方式
        config.headers = new AxiosHeaders({
          ...config.headers?.toJSON(), // 转换现有headers
          ...authHeader,
        });

        return config;
      },
      (error) => Promise.reject(error)
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse): CustomResponse => ({
        ...response,
        message: response.statusText,
      }),
      (error) => {
        if (error.response) {
          return Promise.reject({
            ...error.response,
            message: error.response.data?.message || error.response.statusText,
          });
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<CustomResponse<T>> {
    return this.instance.get(url, config);
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<CustomResponse<T>> {
    return this.instance.put(url, data, config);
  }

  // 其他HTTP方法...
}

export const apiClient = new ApiClient();
