import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ListingsService } from '../../../core/services/listings.service';
import { CarListingSummary, ListingSearchParams } from '../../../core/models/listing.models';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { AuCurrencyPipe } from '../../../shared/pipes/au-currency.pipe';

@Component({
  selector: 'cb-listings-browse',
  standalone: true,
  imports: [FormsModule, RouterLink, DecimalPipe, LoadingSpinnerComponent, PaginationComponent, StatusBadgeComponent, AuCurrencyPipe],
  templateUrl: './listings-browse.component.html',
})
export class ListingsBrowseComponent implements OnInit {
  private readonly listingsService = inject(ListingsService);
  readonly authState = inject(AuthStateService);

  readonly listings = signal<CarListingSummary[]>([]);
  readonly totalCount = signal(0);
  readonly loading = signal(false);

  readonly filters = signal<ListingSearchParams>({ pageNumber: 1, pageSize: 12 });

  // Filter form bindings
  make = '';
  model = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  location = '';
  currentPage = 1;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    const params: ListingSearchParams = {
      make: this.make || undefined,
      model: this.model || undefined,
      minPrice: this.minPrice ?? undefined,
      maxPrice: this.maxPrice ?? undefined,
      location: this.location || undefined,
      pageNumber: this.currentPage,
      pageSize: 12,
    };
    this.listingsService.search(params).subscribe({
      next: (res) => {
        this.listings.set(res.data?.items ?? []);
        this.totalCount.set(res.data?.totalCount ?? 0);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.load();
  }

  clearFilters(): void {
    this.make = '';
    this.model = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.location = '';
    this.currentPage = 1;
    this.load();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.load();
  }
}
