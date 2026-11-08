import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserReport, ReportUserRequest, ReviewReportRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class ReportingService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/reporting`;

  reportUser(req: ReportUserRequest): Observable<any> {
    return this.http.post<any>(`${this.base}/report-user`, req);
  }

  reportListing(req: any): Observable<any> {
    return this.http.post<any>(`${this.base}/report-listing`, req);
  }

  getPendingReports(): Observable<{ data: UserReport[] }> {
    return this.http.get<{ data: UserReport[] }>(`${this.base}/pending`);
  }

  getUserReports(userId: number): Observable<{ data: UserReport[] }> {
    return this.http.get<{ data: UserReport[] }>(`${this.base}/user/${userId}`);
  }

  getReportsByStatus(status: number): Observable<{ data: UserReport[] }> {
    return this.http.get<{ data: UserReport[] }>(`${this.base}/status/${status}`);
  }

  reviewReport(req: ReviewReportRequest): Observable<any> {
    return this.http.post<any>(`${this.base}/review`, req);
  }
}
