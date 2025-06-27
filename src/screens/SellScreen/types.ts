export interface SubPageData {
  id: number;
  title: string;
  target_price: string | null;
  date_value: string;
  car_plate: string;
  mileage: string;
  interchange_car_plate: "yes" | "no";
  car_model: string | null;
  manufacture_year: string;
  year_of_manufacture: string | null;
  lead_id: number;
  date_label: string;
  location?: string;
  tip?: {
    text_color: string;
    description: string;
  };
  ticket_id: number;
  status_display_name: string;
  car_make: string | null;
  payment_document_urls: string[];
  discounts?: any[];
  has_handover_appointment: boolean;
  has_payment_detail: boolean;
  owner_name: string;
  owner_phone_no: string;
  price_label: string;
  price_value: string | null;
  vouchers?: any[];
  processing_fee: number;
  status: {
    name: string;
  };
  auction: {
    id: number;
    status_name: string;
    start_price: string;
    current_amount: string;
    highest_amount: string;
    bid_count: number;
    bidders_count: number;
    time_start: string;
    time_end: string;
    extended_time_end: string;
    is_pending_acceptance: boolean;
    has_viewed: boolean;
  };
}
