export interface NavBarStatusItem {
  name: string;
  url: string;
  display_name: string;
  count?: number; // Optional since not all items have count
}

export interface NavBarItem {
  name: string;
  display_name: string;
  status: NavBarStatusItem[];
}

export interface SellFormNavBarResponse {
  success: {
    message: string;
  };
  data: NavBarItem[];
}
