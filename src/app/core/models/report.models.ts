import { ReportAction, ReportStatus } from './enums';

export interface UserReport {
  id: number;
  reporterId: number;
  reporterName: string;
  reportedUserId: number;
  reportedUserName: string;
  reason: string;
  description: string;
  status: ReportStatus;
  createdDate: string;
}

export interface ReportUserRequest {
  reportedUserId: number;
  reason: string;
  description: string;
}

export interface ReviewReportRequest {
  reportId: number;
  action: ReportAction;
  notes: string;
}

export interface ReportListingRequest {
  carListingId: number;
  reason: string;
  description: string;
}
