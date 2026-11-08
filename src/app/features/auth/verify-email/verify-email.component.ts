import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'cb-verify-email',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-vh-100 bg-dark d-flex align-items-center">
      <div class="container text-center">
        @if (loading()) {
          <div class="spinner-border text-warning" role="status"></div>
          <p class="text-secondary mt-3">Verifying your email...</p>
        } @else if (success()) {
          <i class="bi bi-patch-check-fill text-warning fs-1 d-block mb-3"></i>
          <h3 class="text-white fw-bold">Email Verified!</h3>
          <p class="text-secondary">Your email has been verified. Please wait for admin approval before logging in.</p>
          <a routerLink="/auth/login" class="btn btn-warning fw-semibold mt-2">Go to Login</a>
        } @else {
          <i class="bi bi-x-circle-fill text-danger fs-1 d-block mb-3"></i>
          <h3 class="text-white fw-bold">Verification Failed</h3>
          <p class="text-secondary">{{ errorMessage() }}</p>
          <a routerLink="/auth/login" class="btn btn-outline-warning fw-semibold mt-2">Back to Login</a>
        }
      </div>
    </div>
  `,
})
export class VerifyEmailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  readonly loading = signal(true);
  readonly success = signal(false);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email') ?? '';
    const token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!email || !token) {
      this.loading.set(false);
      this.errorMessage.set('Invalid verification link.');
      return;
    }

    this.authService.verifyEmail(email, token).subscribe({
      next: () => { this.loading.set(false); this.success.set(true); },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message ?? 'Verification link is invalid or expired.');
      },
    });
  }
}
