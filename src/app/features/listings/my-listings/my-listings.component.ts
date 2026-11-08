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

  /** Shortens an engine description to displacement and layout, e.g. "4.0L Twin-Turbo V8" -> "4.0L V8". */
  engineLabel(engine?: string): string {
    if (!engine) return '';
    const disp = engine.match(/(\d+(?:\.\d+)?)\s*L\b/i)?.[1];
    const words: Record<string, string> = { four: '4', six: '6', eight: '8', ten: '10', twelve: '12' };
    const layout = engine.match(/\b(V\d+|W\d+|I\d+|(?:Flat|Inline)[- ](?:\d+|Four|Six|Eight)|Rotary)\b/i)?.[1]
      ?.replace(/[- ](Four|Six|Eight)/i, (_m, w) => '-' + words[w.toLowerCase()]);
    return [disp ? `${disp}L` : '', layout ?? ''].filter(Boolean).join(' ') || engine;
  }

  submitForApproval(id: number): void {
    this.listingsService.submitForApproval(id).subscribe({
      next: () => { this.toast.success('Listing submitted for approval!'); this.ngOnInit(); },
      error: (err) => this.toast.error(err?.error?.message ?? 'Failed.'),
    });
  }
}
