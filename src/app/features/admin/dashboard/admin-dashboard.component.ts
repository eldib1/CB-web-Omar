import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { DashboardStatistics, SystemStatistics } from '../../../core/models/admin.models';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'cb-admin-dashboard',
  standalone: true,
  imports: [RouterLink, DecimalPipe, DatePipe, LoadingSpinnerComponent],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly stats = signal<DashboardStatistics | null>(null);
  readonly sysStats = signal<SystemStatistics | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (s) => { this.stats.set(s); },
      error: () => {},
    });
    this.adminService.getSystemStats().subscribe({
      next: (s) => { this.sysStats.set(s); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
