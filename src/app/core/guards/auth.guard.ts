import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';
import { UserRole } from '../models';

export const authGuard: CanActivateFn = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  if (authState.isAuthenticated()) return true;
  router.navigate(['/auth/login']);
  return false;
};

export const adminGuard: CanActivateFn = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  if (authState.isAdmin()) return true;
  router.navigate(['/']);
  return false;
};

export const superAdminGuard: CanActivateFn = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  if (authState.isSuperAdmin()) return true;
  router.navigate(['/admin/dashboard']);
  return false;
};

export const guestGuard: CanActivateFn = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  if (!authState.isAuthenticated()) return true;
  const role = authState.currentUser()?.role;
  if (role === UserRole.Admin || role === UserRole.SuperAdmin) {
    router.navigate(['/admin/dashboard']);
  } else {
    router.navigate(['/listings']);
  }
  return false;
};
