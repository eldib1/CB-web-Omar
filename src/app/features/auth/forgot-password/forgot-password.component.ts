import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'cb-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-vh-100 bg-dark d-flex align-items-center py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-6 col-lg-4">
            <div class="text-center mb-4">
              <a routerLink="/" class="text-decoration-none">
                <i class="bi bi-car-front-fill text-warning fs-1"></i>
                <h1 class="text-warning fw-bold fs-3 mt-2">ClutchBids</h1>
              </a>
            </div>
            <div class="card bg-dark border border-secondary shadow-lg">
              <div class="card-body p-4">
                @if (!sent()) {
                  <h4 class="text-white fw-bold mb-2">Reset Password</h4>
                  <p class="text-secondary small mb-4">Enter your email and we'll send you a reset link.</p>
                  <form [formGroup]="form" (ngSubmit)="submit()">
                    <div class="mb-3">
                      <label class="form-label text-light small">Email Address</label>
                      <input
                        type="email"
                        class="form-control bg-dark text-light border-secondary"
                        [class.is-invalid]="form.controls['email'].invalid && form.controls['email'].touched"
                        formControlName="email"
                        placeholder="you@example.com"
                      />
                    </div>
                    <button type="submit" class="btn btn-warning w-100 fw-semibold" [disabled]="loading()">
                      @if (loading()) { <span class="spinner-border spinner-border-sm me-2"></span> }
                      Send Reset Link
                    </button>
                  </form>
                } @else {
                  <div class="text-center py-3">
                    <i class="bi bi-envelope-check-fill text-warning fs-1 d-block mb-3"></i>
                    <h5 class="text-white fw-bold">Check Your Email</h5>
                    <p class="text-secondary small">A password reset link has been sent to your email.</p>
                  </div>
                }
                <p class="text-secondary text-center small mt-3 mb-0">
                  <a routerLink="/auth/login" class="text-warning">Back to Login</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);

  readonly loading = signal(false);
  readonly sent = signal(false);

  readonly form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.authService.forgotPassword(this.form.value.email!).subscribe({
      next: () => { this.sent.set(true); },
      error: (err) => {
        this.toast.error(err?.error?.message ?? 'Failed to send reset link.');
        this.loading.set(false);
      },
    });
  }
}
