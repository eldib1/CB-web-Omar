import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { UserDetail } from '../../../core/models/user.models';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { DecimalPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'cb-user-profile',
  standalone: true,
  imports: [RouterLink, DecimalPipe, LoadingSpinnerComponent, StatusBadgeComponent, DatePipe],
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
  readonly authState = inject(AuthStateService);
  private readonly adminService = inject(AdminService);
  private readonly toast = inject(ToastService);

  readonly user = signal<UserDetail | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    const userId = this.authState.currentUser()?.id;
    if (!userId) return;
    this.adminService.getUserDetail(userId).subscribe({
      next: (u) => { this.user.set(u); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
