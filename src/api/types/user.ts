// 用户相关类型
export interface User {
  id: string;
  name?: string;
  phone: string;
  email?: string;
  token?: string;
  points?: number;
  countryCode: string;
  city?: City;
  profileImageUrl?: string;
  isVerified: boolean;
  hasRequestedVerification: boolean;
  isActive: boolean;
  activeGroupId?: string;
  groups: Record<string, Group>;
  homeGroups: Group[];
  blacklistedOrganizationIds: string[];
  whitelistedCityIds: string[];
  whitelistedApps: string[];
  assigneePhone?: string;
  followedAuctionsIds: string[];
  locale?: UserLocale;
  membershipTier?: string;
  userTier?: string;
  isFreemium: boolean;
  availablePersonas?: PersonaData[];
  persona?: PersonaData;
  isNewUser: boolean;
}

interface City {
  id: string;
  name: string;
  // 其他城市字段...
}

interface Group {
  id: string;
  name: string;
  // 其他群组字段...
}

interface UserLocale {
  language: string;
  country: string;
}

interface PersonaData {
  id: string;
  name: string;
  // 其他角色字段...
}
