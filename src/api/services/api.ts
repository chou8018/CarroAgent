import { config } from "../../config/config";
import { AxiosResponseHeaders, AxiosRequestConfig } from "axios";

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: AxiosResponseHeaders;
  config: AxiosRequestConfig;
  request?: any;
  message?: string;
}

interface ApiClientOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
}

class ApiClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly envName: string;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl || config.apiUrl;
    this.envName = config.env;

    // 初始化默认请求头
    this.defaultHeaders = {
      "X-Environment": this.envName,
      "Content-Type": "application/json",
      ...options.headers,
    };
  }

  private async request<T>(endpoint: string, init?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}/${endpoint.replace(/^\//, "")}`;

    const response = await fetch(url, {
      ...init,
      headers: {
        ...this.defaultHeaders,
        ...init?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json() as Promise<T>;
  }

  public async get<T>(
    endpoint: string,
    init?: Omit<RequestInit, "method">
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...init,
      method: "GET",
    });
  }

  public async post<T>(
    endpoint: string,
    body: any,
    init?: Omit<RequestInit, "method" | "body">
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...init,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  public async put<T>(
    endpoint: string,
    body: any,
    init?: Omit<RequestInit, "method" | "body">
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...init,
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  public async delete<T>(
    endpoint: string,
    init?: Omit<RequestInit, "method">
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...init,
      method: "DELETE",
    });
  }
}

// 导出预配置的实例
export const apiClient = new ApiClient();

// 也可以按需创建实例
export const createApiClient = (options: ApiClientOptions) =>
  new ApiClient(options);
