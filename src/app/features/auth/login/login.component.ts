import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { ToastService } from '../../../core/services/toast.service';
import { NotificationHubService } from '../../../core/services/notification-hub.service';
import { ChatHubService } from '../../../core/services/chat-hub.service';
import { UserRole } from '../../../core/models/enums';

@Component({
  selector: 'cb-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly authState = inject(AuthStateService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly notifHub = inject(NotificationHubService);
  private readonly chatHub = inject(ChatHubService);

  readonly loading = signal(false);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  get f() {
    return this.form.controls;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.authService.login({ email: this.f['email'].value!, password: this.f['password'].value! }).subscribe({
      next: () => {
        this.notifHub.startConnection();
        this.chatHub.startConnection();
        const role = this.authState.currentUser()?.role;
        if (role === UserRole.Admin || role === UserRole.SuperAdmin) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/listings']);
        }
      },
      error: (err) => {
        this.toast.error(err?.error?.message ?? 'Login failed. Please check your credentials.');
        this.loading.set(false);
      },
    });
  }
}
