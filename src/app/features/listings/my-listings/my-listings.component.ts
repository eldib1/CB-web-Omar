import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ListingsService } from '../../../core/services/listings.service';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { ToastService } from '../../../core/services/toast.service';
import { CarListingSummary } from '../../../core/models/listing.models';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { AuCurrencyPipe } from '../../../shared/pipes/au-currency.pipe';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'cb-my-listings',
  standalone: true,
  imports: [RouterLink, LoadingSpinnerComponent, StatusBadgeComponent, AuCurrencyPipe, DatePipe, DecimalPipe],
  templateUrl: './my-listings.component.html',
})
export class MyListingsComponent implements OnInit {
  private readonly listingsService = inject(ListingsService);
  readonly authState = inject(AuthStateService);
  private readonly toast = inject(ToastService);

  readonly listings = signal<CarListingSummary[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    const userId = this.authState.currentUser()?.id;
    // Search by current user - the API sorts/filters by seller
    this.listingsService.search({ pageSize: 50 }).subscribe({
      next: (res) => { this.listings.set(res.data?.items ?? []); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  submitForApproval(id: number): void {
    this.listingsService.submitForApproval(id).subscribe({
      next: () => { this.toast.success('Listing submitted for approval!'); this.ngOnInit(); },
      error: (err) => this.toast.error(err?.error?.message ?? 'Failed.'),
    });
  }
}
