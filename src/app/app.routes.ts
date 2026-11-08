import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/auth.guard';
import { superAdminGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/listings', pathMatch: 'full' },

  // Auth
  {
    path: 'auth/login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'auth/reset-password',
    loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'auth/verify-email',
    loadComponent: () => import('./features/auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent)
  },

  // Listings
  {
    path: 'listings',
    loadComponent: () => import('./features/listings/listings-browse/listings-browse.component').then(m => m.ListingsBrowseComponent)
  },
  {
    path: 'listings/create',
    canActivate: [authGuard],
    loadComponent: () => import('./features/listings/create-listing/create-listing.component').then(m => m.CreateListingComponent)
  },
  {
    path: 'listings/my',
    canActivate: [authGuard],
    loadComponent: () => import('./features/listings/my-listings/my-listings.component').then(m => m.MyListingsComponent)
  },
  {
    path: 'listings/:id',
    loadComponent: () => import('./features/listings/listing-detail/listing-detail.component').then(m => m.ListingDetailComponent)
  },

  // Chat
  {
    path: 'chat',
    canActivate: [authGuard],
    loadComponent: () => import('./features/chat/chat/chat.component').then(m => m.ChatComponent)
  },

  // User profile
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/user/profile/user-profile.component').then(m => m.UserProfileComponent)
  },

  // Admin
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'listings',
        loadComponent: () => import('./features/admin/listing-management/listing-management.component').then(m => m.ListingManagementComponent)
      },
      {
        path: 'configs',
        loadComponent: () => import('./features/admin/system-configs/system-configs.component').then(m => m.SystemConfigsComponent)
      },
      {
        path: 'listing-codes',
        loadComponent: () => import('./features/admin/listing-codes/listing-codes.component').then(m => m.ListingCodesComponent)
      },
      {
        path: 'manage-admins',
        canActivate: [superAdminGuard],
        loadComponent: () => import('./features/admin/manage-admins/manage-admins.component').then(m => m.ManageAdminsComponent)
      }
    ]
  },

  // Static pages
  {
    path: 'about',
    loadComponent: () => import('./features/static/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'faq',
    loadComponent: () => import('./features/static/faq/faq.component').then(m => m.FaqComponent)
  },
  {
    path: 'terms',
    loadComponent: () => import('./features/static/terms/terms.component').then(m => m.TermsComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/static/privacy/privacy.component').then(m => m.PrivacyComponent)
  },

  // Fallback
  { path: '**', redirectTo: '/listings' }
];
