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

  readonly featured = signal<CarListingSummary | null>(null);
  /** Slots for the four thumbnail tiles beside the main hero image. */
  readonly thumbSlots = [1, 2, 3, 4];
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

  /** Initializes component by fetching featured listing and loading search results. */
  ngOnInit(): void {
    this.listingsService.getFeatured().subscribe({
      next: (f) => this.featured.set(f),
      error: () => this.featured.set(null),
    });
    this.load();
  }

  /** Fetches paginated car listings matching current filters. */
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

  /** Resets page number to 1 and applies active filters. */
  applyFilters(): void {
    this.currentPage = 1;
    this.load();
  }

  /** Resets all filters and reloads listings. */
  clearFilters(): void {
    this.make = '';
    this.model = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.location = '';
    this.currentPage = 1;
    this.load();
  }

  /** Handles page change event. */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.load();
  }

  /** Shortens an engine description to displacement and layout, e.g. "4.0L Twin-Turbo V8" -> "4.0L V8". */
  engineLabel(engine?: string): string {
    if (!engine) return '';
    const disp = engine.match(/(\d+(?:\.\d+)?)\s*L\b/i)?.[1];
    const words: Record<string, string> = { four: '4', six: '6', eight: '8', ten: '10', twelve: '12' };
    const layout = engine.match(/\b(V\d+|W\d+|I\d+|(?:Flat|Inline)[- ](?:\d+|Four|Six|Eight)|Rotary)\b/i)?.[1]
      ?.replace(/[- ](Four|Six|Eight)/i, (_m, w) => '-' + words[w.toLowerCase()]);
    return [disp ? `${disp}L` : '', layout ?? ''].filter(Boolean).join(' ') || engine;
  }
}
