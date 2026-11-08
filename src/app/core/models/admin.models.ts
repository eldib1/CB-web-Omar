import { UserRole } from './enums';

export interface AdminSummary {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  createdDate: string;
  lastActiveDate: string;
  totalApprovals: number;
}

export interface AdminDetail extends AdminSummary {
  totalRejections: number;
  totalSuspensions: number;
}

export interface CreateAdminRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface DashboardStatistics {
  totalUsers: number;
  totalListings: number;
  totalOffers: number;
  totalReports: number;
  pendingApprovals: number;
  activeListings: number;
  suspendedUsers: number;
  newUsersThisMonth: number;
  successfulTransactions: number;
  platformRevenue: number;
}

export interface SystemStatistics {
  totalSystemUsers: number;
  verifiedUsers: number;
  pendingVerificationUsers: number;
  suspendedUsers: number;
  totalListingsCreated: number;
  activeListings: number;
  soldListings: number;
  rejectedListings: number;
  totalOffers: number;
  acceptedOffers: number;
  rejectedOffers: number;
  userReports: {
    total: number;
    pending: number;
    resolved: number;
    dismissed: number;
  };
  topListingCities: { city: string; count: number }[];
  averageOfferAcceptanceRate: number;
  lastUpdated: string;
}

export interface SystemConfig {
  key: string;
  value: string;
  valueType: string;
  description: string;
  lastUpdatedDate?: string;
}

export interface UpdateConfigRequest {
  value: string;
  description?: string;
}

export interface ListingCode {
  id: number;
  code: string;
  status: string;
  createdDate: string;
  assignedDate?: string;
  usedDate?: string;
  assignedToUser?: string;
  usedForListing?: string;
  expiryDate?: string;
}

export interface GenerateCodesRequest {
  count: number;
}
