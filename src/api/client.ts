// src/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { config as appConfig } from "../config/config";

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
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const token = ""; // 从存储获取
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
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

  // 其他方法...
}

export const apiClient = new ApiClient();
