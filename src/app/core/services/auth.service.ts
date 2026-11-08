import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import { AuthStateService } from './auth-state.service';
import { LoginRequest, RegisterRequest, ResetPasswordRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(AuthApiService);
  private readonly state = inject(AuthStateService);
  private readonly router = inject(Router);

  login(req: LoginRequest): Observable<any> {
    return this.api.login(req).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.state.setUser(res.data);
        }
      }),
    );
  }

  register(req: RegisterRequest): Observable<any> {
    return this.api.register(req);
  }

  logout(): void {
    this.state.clearUser();
    this.router.navigate(['/auth/login']);
  }

  forgotPassword(email: string): Observable<any> {
    return this.api.forgotPassword(email);
  }

  resetPassword(req: ResetPasswordRequest): Observable<any> {
    return this.api.resetPassword(req);
  }

  verifyEmail(email: string, token: string): Observable<any> {
    return this.api.verifyEmail(email, token);
  }
}
