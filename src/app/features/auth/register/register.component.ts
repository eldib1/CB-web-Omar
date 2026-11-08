import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { passwordMatchValidator, passwordStrengthValidator, australianPhoneValidator } from '../../../shared/validators/custom-validators';
import { FileUploadComponent } from '../../../shared/file-upload/file-upload.component';

@Component({
  selector: 'cb-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FileUploadComponent],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);

  readonly loading = signal(false);
  readonly success = signal(false);
  readonly registeredEmail = signal('');

  readonly form = this.fb.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, australianPhoneValidator()]],
      password: ['', [Validators.required, passwordStrengthValidator()]],
      confirmPassword: ['', Validators.required],
      agreeTerms: [false, Validators.requiredTrue],
    },
    { validators: passwordMatchValidator('password', 'confirmPassword') },
  );

  get f() {
    return this.form.controls;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    const { fullName, email, phoneNumber, password } = this.form.value;
    this.authService
      .register({ fullName: fullName!, email: email!, phoneNumber: phoneNumber!, password: password! })
      .subscribe({
        next: () => {
          this.registeredEmail.set(email!);
          this.success.set(true);
        },
        error: (err) => {
          this.toast.error(err?.error?.message ?? 'Registration failed. Please try again.');
          this.loading.set(false);
        },
      });
  }
}
