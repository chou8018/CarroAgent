interface Role {
  id: number;
  display_name: string;
  name: string;
  type: string;
}

interface GroupInfo {
  id: number;
  is_suspended: boolean;
  allow_used_cases: number;
  default_location_of_stock: null;
  group: {
    id: number;
    contact_number: null;
    is_internal: number;
    country_id: number;
    published: boolean;
    business_registration_number: null;
    location_text: null;
    address: string;
    display_name: string;
    company_registration_number: string;
    postal_code: null;
    tax_identification_number: string;
    sst_registration_number: string;
    name: string;
    email: null;
  };
  is_active: boolean;
  allow_new_cases: number;
}

interface Permissions {
  group: string[];
  user: string[];
  global: string[];
}

interface Group {
  id: number;
  contact_number: null;
  is_internal: number;
  role: Role;
  country_id: number;
  published: boolean;
  business_registration_number: null;
  permissions: Permissions;
  location_text: string | null;
  address: string;
  display_name: string;
  company_registration_number: string;
  postal_code: null;
  tax_identification_number: string;
  sst_registration_number: string;
  name: string;
  email: null;
  groupInfo?: GroupInfo;
}

interface AdditionalData {
  location: null;
  source: null;
  reason_for_blacklist: null;
  risk: null;
  app_version: null;
  activated_by_name: null;
  offline_card_id: null;
  relationship_manager_id: null;
  race: null;
  is_guaranteed_acceptance: null;
  beta_options: null;
  activated_by: null;
  payment_mode: null;
  relationship_manager_name: null;
  self_assign_tickets: null;
  bank_account_number: null;
  device_os: null;
  bic: null;
  activation_code: null;
  blacklist_organization_ids: null;
  bank_name: null;
  bene_account_number: null;
  address: null;
  is_premium: null;
}

interface ShopGroup {
  created_at: string;
  id: number;
  additional_data: {
    location_id: null;
    user_login_at: string;
    membership_tier: string;
  };
  level: number;
  make_id: null;
  location_coordinates: null;
  address: string;
  business_letter_address: null;
  description: string;
  country_id: number;
  location_text: null;
  sst_registration_number: string;
  users_count: number;
  display_name: string;
  size_of_showroom: null;
  postal_code: null;
  business_registration_number: null;
  contact_person: null;
  email: null;
  social_data: null;
  documents: any[];
  name: string;
  display_bid_count: boolean;
  tax_identification_number: string;
  company_registration_number: string;
  contact_number: null;
  published_on_web: boolean;
  group_id: null;
  tier: string;
  city_id: number;
  point: number;
  whitelist_apps: any[];
  province_id: null;
}

interface Shop {
  group: ShopGroup;
  id: number;
  pages: null;
  updated_at: string;
  name: string;
  created_at: string;
}

interface Country {
  id: number;
  created_at: string;
  currency_code: string;
  is_active: number;
  deleted_at: null;
  phone_code: string;
  language_options: Array<{
    label: string;
    code: string;
  }>;
  display_name: string;
  language: null;
  updated_at: string;
  currency_symbol: string;
  timezone: string;
  country_code: string;
  name: string;
}

interface Locale {
  language: string;
}

interface Persona {
  value: string;
  display_name: string;
  selectable: boolean;
  selected: boolean;
}

interface Personas {
  current: null;
  others: Persona[];
}

interface WhitelistApp {
  id: number;
  name: string;
  display_name: string;
}

interface City {
  id: number;
  display_name: string;
  lat: string;
  name: string;
  lng: string;
}

export interface User {
  first_login: string;
  business_grade: null;
  last_bidded_at: null;
  id: number;
  sso_user_id: string;
  social_data: null;
  reviewers_count: number;
  first_login_app: null;
  is_blacklist: null;
  company_name: null;
  has_national_identity_number: boolean;
  is_show_new_feature_popup: boolean;
  valid_email: boolean;
  is_signed_policy: boolean;
  profile_image: null;
  secondary_phone: null;
  groups: Group[];
  additional_data: AdditionalData;
  shop: Shop;
  dealer_category: null;
  address: null;
  tax_identification_number: null;
  is_show_congratulation_popup: boolean;
  is_active: boolean;
  has_request_verification: boolean;
  location_id: number;
  is_high_risk_buyer: number;
  date_of_birth: string;
  assignee_id: null;
  bids_count: number;
  name: string;
  attachment_count: number;
  extra_notes: null;
  country: Country;
  locale: Locale;
  display_name: null;
  email: string;
  notification_preferences: null;
  last_name: null;
  reviews_count: number;
  national_identity_number: string;
  personas: Personas;
  last_login_app: string;
  active_group: Group;
  whitelist_apps: WhitelistApp[];
  first_name: null;
  auctions_count: number;
  is_verified: boolean;
  active_group_id: number;
  gender: null;
  verification_data: null;
  phone: string;
  win_auctions_count: number;
  valid_whatsapp: boolean;
  city: City;
  activity_grade: null;
  documents: any[];
  last_login: string;
  is_manager: boolean;
  is_show_welcome_popup: boolean;
  sms_code: null;
}
