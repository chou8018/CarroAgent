import type { BaseResponse } from "../types/appointment";
export interface Banner {
  action: string;
  url: string;
  position: string;
  image_url: string;
  created_at: string;
  liner: string;
  action_key: string;
}

export interface BannerResponse extends BaseResponse {
  data: {
    banners: Banner[];
  };
}
