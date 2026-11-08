import { UserRole, UserStatus } from './enums';

export interface UserSummary {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  status: UserStatus;
  role: UserRole;
  registrationDate: string;
  totalListings: number;
  totalOffers: number;
  rating: number;
}

export interface UserDetail extends UserSummary {
  emailVerifiedDate?: string;
  lastLoginDate?: string;
  suspensionReason?: string;
  suspensionDate?: string;
}

export interface UserVerification {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  status: UserStatus;
  documentUrl: string;
  identityNumber: string;
  identityExpiryDate: string;
  documentUploadDate: string;
  registrationDate: string;
}

export interface ApproveUserRequest {
  userId: number;
}

export interface RejectUserRequest {
  userId: number;
  rejectionReason: string;
}

export interface AssignListingCodesRequest {
  userId: number;
  count: number;
}

export interface UploadIdDocumentRequest {
  userId: number;
  identityNumber: string;
  identityExpiryDate: string;
}
