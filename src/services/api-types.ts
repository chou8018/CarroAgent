// 定义API响应格式
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// 定义各端点返回类型
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}
