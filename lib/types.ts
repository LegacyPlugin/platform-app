  export interface Plugin {
    id: number;
    name: string;
    identifier: string;
    price: number;
    compatibleVersions?: string;
    features?: string;
    commands?: string;
    permissions?: string;
    videoPreview?: string;
    imageUrls?: string[];
  }

  export interface LoginRequest {
    username: string;
    password: string;
  }

  export interface RegisterRequest {
    username: string;
    password: string;
    email?: string;
  }

  export interface AuthResponse {
    token: string;
  }

  export interface ClientProfileResponse {
    username: string;
    email?: string;
    role: string;
  }

  export interface LicenseResponse {
    id: number;
    licenseKey: string;
    customerName: string;
    email: string;
    validUntil: string | null;
    active: boolean;
    serverIp: string | null;
    serverFingerprint: string | null;
    allowedPlugins: string[];
  }

  export interface SaleResponse {
    id: number;
    pluginName: string;
    amount: number;
    createdAt: string;
  }

  export interface TopBuyerResponse {
    username: string;
    totalSpent: number;
    avatarUrl?: string;
  }

  export interface PluginRequest {
    name: string;
    identifier: string;
    price: number;
    compatibleVersions?: string;
    features?: string;
    commands?: string;
    permissions?: string;
    videoPreview?: string;
    imageUrls?: string[];
  }

  export interface ActivityLogResponse {
    action: string;
    details: string;
    ipAddress: string;
    timestamp: string;
  }

  export interface AdminUserResponse {
    id: number;
    username: string;
    email?: string;
    role: string;
  }

  export interface DashboardStatsResponse {
    totalLicenses: number;
    activeLicenses: number;
    totalUsers: number;
    totalRevenue: number;
    monthlyRevenue: number;
    totalPartners: number;
    onlineServers: number;
    averageTicket: number;
    revenueChart?: { date: string; amount: number }[];
    topPlugins?: { name: string; sales: number }[];
  }

  export interface AdminSaleResponse {
    id: number;
    pluginName: string;
    customerEmail: string;
    amount: number;
    createdAt: string;
  }

  export interface PartnerResponse {
    id: number;
    name: string;
    email: string;
    slug: string;
    pixKey: string;
    balance: number;
    commissionPercent: number;
    active: boolean;
  }

  export interface CreatePartnerRequest {
    name: string;
    email: string;
    slug: string;
    pixKey: string;
    commissionPercent: number;
  }

  export interface CouponResponse {
    id: number;
    code: string;
    discountPercent: number;
    validUntil?: string;
    usageLimit: number;
    usages: number;
    active: boolean;
  }

  export interface CreateCouponRequest {
    code: string;
    discountPercent: number;
    validUntil?: string;
    usageLimit: number;
  }

  export interface AdminPluginVersionResponse {
    id: number;
    version: string;
    fileName: string;
    changelog: string;
    uploadDate: string;
  }
