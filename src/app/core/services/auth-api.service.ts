import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  ResetPasswordRequest,
} from '../models';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/auth`;

  login(req: LoginRequest): Observable<ApiResponse<AuthUser>> {
    return this.http.post<ApiResponse<AuthUser>>(`${this.base}/login`, req);
  }

  register(req: RegisterRequest): Observable<ApiResponse<{ id: number; email: string }>> {
    return this.http.post<ApiResponse<{ id: number; email: string }>>(`${this.base}/register`, req);
  }

  verifyEmail(email: string, token: string): Observable<{ message: string }> {
    const params = new HttpParams().set('email', email).set('token', token);
    return this.http.post<{ message: string }>(`${this.base}/verify-email`, null, { params });
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/forgot-password`, JSON.stringify(email), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  resetPassword(req: ResetPasswordRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/reset-password`, req);
  }

  refreshToken(req: RefreshTokenRequest): Observable<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    return this.http.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      `${this.base}/refresh-token`,
      req,
    );
  }
}
