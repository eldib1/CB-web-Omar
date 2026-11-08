import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthStateService } from '../services/auth-state.service';
import { AuthApiService } from '../services/auth-api.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const authState = inject(AuthStateService);
  const authApi = inject(AuthApiService);
  const router = inject(Router);

  const token = authState.getAccessToken();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/')) {
        const refreshToken = authState.getRefreshToken();
        if (refreshToken) {
          return authApi.refreshToken({ refreshToken }).pipe(
            switchMap((res) => {
              if (res.success && res.data) {
                authState.updateTokens(res.data.accessToken, res.data.refreshToken);
                const retried = req.clone({
                  setHeaders: { Authorization: `Bearer ${res.data.accessToken}` },
                });
                return next(retried);
              }
              authState.clearUser();
              router.navigate(['/auth/login']);
              return throwError(() => error);
            }),
            catchError(() => {
              authState.clearUser();
              router.navigate(['/auth/login']);
              return throwError(() => error);
            }),
          );
        } else {
          authState.clearUser();
          router.navigate(['/auth/login']);
        }
      }
      return throwError(() => error);
    }),
  );
};
