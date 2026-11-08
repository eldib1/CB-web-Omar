import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  UserSummary,
  UserDetail,
  UserVerification,
  ApproveUserRequest,
  RejectUserRequest,
  AssignListingCodesRequest,
  DashboardStatistics,
  SystemStatistics,
  SystemConfig,
  UpdateConfigRequest,
  ListingCode,
  GenerateCodesRequest,
} from '../models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly adminBase = `${environment.apiBaseUrl}/admin`;
  private readonly dashboardBase = `${environment.apiBaseUrl}/dashboard`;
  private readonly configBase = `${environment.apiBaseUrl}/configuration`;
  private readonly codesBase = `${environment.apiBaseUrl}/listingcodes`;

  // Users
  getPendingUsers(): Observable<{ data: UserSummary[] }> {
    return this.http.get<{ data: UserSummary[] }>(`${this.adminBase}/pending-users`);
  }

  getAllUsers(): Observable<{ data: UserSummary[] }> {
    return this.http.get<{ data: UserSummary[] }>(`${this.adminBase}/all-users`);
  }

  getUserDetail(userId: number): Observable<UserDetail> {
    return this.http.get<UserDetail>(`${this.adminBase}/user/${userId}`);
  }

  getPendingVerifications(): Observable<{ data: UserVerification[] }> {
    return this.http.get<{ data: UserVerification[] }>(`${this.adminBase}/pending-verifications`);
  }

  getUserForVerification(userId: number): Observable<UserVerification> {
    return this.http.get<UserVerification>(`${this.adminBase}/user-verification/${userId}`);
  }

  approveUser(req: ApproveUserRequest): Observable<any> {
    return this.http.post<any>(`${this.adminBase}/approve-user`, req);
  }

  rejectUser(req: RejectUserRequest): Observable<any> {
    return this.http.post<any>(`${this.adminBase}/reject-user`, req);
  }

  suspendUser(userId: number): Observable<any> {
    return this.http.post<any>(`${this.adminBase}/suspend-user/${userId}`, {});
  }

  assignListingCodes(req: AssignListingCodesRequest): Observable<any> {
    return this.http.post<any>(`${this.adminBase}/assign-listing-codes`, req);
  }

  uploadIdDocument(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.adminBase}/upload-id-document`, formData);
  }

  // Dashboard
  getDashboardStats(): Observable<DashboardStatistics> {
    return this.http.get<DashboardStatistics>(`${this.dashboardBase}/statistics`);
  }

  getSystemStats(): Observable<SystemStatistics> {
    return this.http.get<SystemStatistics>(`${this.dashboardBase}/system-statistics`);
  }

  // Configurations
  getAllConfigs(): Observable<{ data: SystemConfig[] }> {
    return this.http.get<{ data: SystemConfig[] }>(`${this.configBase}`);
  }

  getConfig(key: string): Observable<SystemConfig> {
    return this.http.get<SystemConfig>(`${this.configBase}/${key}`);
  }

  updateConfig(key: string, req: UpdateConfigRequest): Observable<any> {
    return this.http.put<any>(`${this.configBase}/${key}`, req);
  }

  // Listing Codes
  generateCodes(req: GenerateCodesRequest): Observable<any> {
    return this.http.post<any>(`${this.codesBase}/generate`, req);
  }

  getUnusedCodes(): Observable<{ data: ListingCode[] }> {
    return this.http.get<{ data: ListingCode[] }>(`${this.codesBase}/unused`);
  }

  getAllCodes(): Observable<{ data: ListingCode[] }> {
    return this.http.get<{ data: ListingCode[] }>(`${this.codesBase}/all`);
  }

  validateCode(code: string, listingId: number): Observable<any> {
    return this.http.post<any>(`${this.codesBase}/validate/${code}`, { listingId });
  }
}
