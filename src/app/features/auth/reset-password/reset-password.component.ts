import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { passwordStrengthValidator, passwordMatchValidator } from '../../../shared/validators/custom-validators';

@Component({
  selector: 'cb-reset-password',
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
                <h4 class="text-white fw-bold mb-4">Set New Password</h4>
                <form [formGroup]="form" (ngSubmit)="submit()">
                  <div class="mb-3">
                    <label class="form-label text-light small">New Password</label>
                    <input type="password" class="form-control bg-dark text-light border-secondary"
                      [class.is-invalid]="form.controls['newPassword'].invalid && form.controls['newPassword'].touched"
                      formControlName="newPassword" placeholder="Min 8 chars, upper, lower & number" />
                    @if (form.controls['newPassword'].errors?.['passwordStrength'] && form.controls['newPassword'].touched) {
                      <div class="invalid-feedback">Password must meet strength requirements.</div>
                    }
                  </div>
                  <div class="mb-4">
                    <label class="form-label text-light small">Confirm Password</label>
                    <input type="password" class="form-control bg-dark text-light border-secondary"
                      [class.is-invalid]="form.errors?.['passwordMismatch'] && form.controls['confirmPassword'].touched"
                      formControlName="confirmPassword" placeholder="Repeat password" />
                    @if (form.errors?.['passwordMismatch'] && form.controls['confirmPassword'].touched) {
                      <div class="invalid-feedback d-block">Passwords do not match.</div>
                    }
                  </div>
                  <button type="submit" class="btn btn-warning w-100 fw-semibold" [disabled]="loading()">
                    @if (loading()) { <span class="spinner-border spinner-border-sm me-2"></span> }
                    Reset Password
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly loading = signal(false);
  private email = '';
  private token = '';

  readonly form = this.fb.group(
    {
      newPassword: ['', [Validators.required, passwordStrengthValidator()]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator('newPassword', 'confirmPassword') },
  );

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.authService.resetPassword({ email: this.email, token: this.token, newPassword: this.form.value.newPassword! })
      .subscribe({
        next: () => {
          this.toast.success('Password reset successfully.');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.toast.error(err?.error?.message ?? 'Failed to reset password. Link may have expired.');
          this.loading.set(false);
        },
      });
  }
}
