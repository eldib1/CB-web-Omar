import { Injectable, signal, computed } from '@angular/core';
import { AuthUser, UserRole } from '../models';

const ACCESS_TOKEN_KEY = 'cb_access_token';
const REFRESH_TOKEN_KEY = 'cb_refresh_token';
const USER_KEY = 'cb_user';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly _currentUser = signal<AuthUser | null>(this.loadUser());

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());
  readonly isAdmin = computed(() =>
    [UserRole.Admin, UserRole.SuperAdmin].includes(this._currentUser()?.role as UserRole),
  );
  readonly isSuperAdmin = computed(() => this._currentUser()?.role === UserRole.SuperAdmin);
  readonly isUser = computed(() => this._currentUser()?.role === UserRole.User);

  setUser(user: AuthUser): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, user.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, user.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this._currentUser.set(user);
  }

  updateTokens(accessToken: string, refreshToken: string): void {
    const user = this._currentUser();
    if (user) {
      const updated = { ...user, accessToken, refreshToken };
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      this._currentUser.set(updated);
    }
  }

  clearUser(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._currentUser.set(null);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  hasRole(...roles: UserRole[]): boolean {
    const role = this._currentUser()?.role;
    return role ? roles.includes(role as UserRole) : false;
  }

  private loadUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
