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
      } as RawAxiosRequestHeaders,
    });

    this.setupInterceptors();
  }

  private async getAuthHeader(): Promise<Record<string, string>> {
    const token = await getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      async (config) => {
        const authHeader = await this.getAuthHeader();

        config.headers = new AxiosHeaders({
          ...config.headers?.toJSON(),
          ...authHeader,
        });

        return config;
      },
      (error) => Promise.reject(error)
    );

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

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<CustomResponse<T>> {
    return this.instance.post(url, data, config);
  }

  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<CustomResponse<T>> {
    return this.instance.patch(url, data, config);
  }

  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<CustomResponse<T>> {
    return this.instance.delete(url, config);
  }
}

export const apiClient = new ApiClient();
