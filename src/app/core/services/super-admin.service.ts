import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminSummary, AdminDetail, CreateAdminRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class SuperAdminService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/superadmin`;

  createAdmin(req: CreateAdminRequest): Observable<any> {
    return this.http.post<any>(`${this.base}/create-admin`, req);
  }

  getAllAdmins(): Observable<{ data: AdminSummary[] }> {
    return this.http.get<{ data: AdminSummary[] }>(`${this.base}/admins`);
  }

  getAdminDetail(adminId: number): Observable<AdminDetail> {
    return this.http.get<AdminDetail>(`${this.base}/admin/${adminId}`);
  }

  removeAdmin(adminId: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/remove-admin/${adminId}`);
  }
}
