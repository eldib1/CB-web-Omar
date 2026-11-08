import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ListingsService } from '../../../core/services/listings.service';
import { OffersService } from '../../../core/services/offers.service';
import { ReportingService } from '../../../core/services/reporting.service';
import { AdminService } from '../../../core/services/admin.service';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { ToastService } from '../../../core/services/toast.service';
import { CarListingDetail } from '../../../core/models/listing.models';
import { UserRole } from '../../../core/models/enums';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { ConfirmModalComponent } from '../../../shared/confirm-modal/confirm-modal.component';
import { AuCurrencyPipe } from '../../../shared/pipes/au-currency.pipe';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'cb-listing-detail',
  standalone: true,
  imports: [RouterLink, LoadingSpinnerComponent, StatusBadgeComponent, ConfirmModalComponent, AuCurrencyPipe, DatePipe, DecimalPipe, ReactiveFormsModule],
  templateUrl: './listing-detail.component.html',
})
export class ListingDetailComponent implements OnInit {
  readonly authState = inject(AuthStateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly listingsService = inject(ListingsService);
  private readonly offersService = inject(OffersService);
  private readonly reportingService = inject(ReportingService);
  private readonly adminService = inject(AdminService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  readonly listing = signal<CarListingDetail | null>(null);
  readonly loading = signal(true);
  readonly activeImageIndex = signal(0);

  readonly showOfferModal = signal(false);
  readonly showRejectModal = signal(false);
  readonly showReportModal = signal(false);
  readonly showDeactivateModal = signal(false);
  readonly submitting = signal(false);

  readonly UserRole = UserRole;

  readonly offerForm = this.fb.group({
    offerPrice: [null as number | null, [Validators.required, Validators.min(1)]],
    message: [''],
  });

  readonly rejectForm = this.fb.group({
    reason: ['', Validators.required],
  });

  readonly reportForm = this.fb.group({
    reason: ['', Validators.required],
    description: ['', Validators.required],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.listingsService.getById(id).subscribe({
      next: (data) => { this.listing.set(data); this.loading.set(false); },
      error: () => { this.loading.set(false); this.router.navigate(['/listings']); },
    });
  }

  setActiveImage(index: number): void {
    this.activeImageIndex.set(index);
  }

  // Offer
  submitOffer(): void {
    if (this.offerForm.invalid) { this.offerForm.markAllAsTouched(); return; }
    this.submitting.set(true);
    const listingId = this.listing()!.id;
    this.offersService.create({ listingId, offerPrice: this.offerForm.value.offerPrice!, message: this.offerForm.value.message || undefined }).subscribe({
      next: () => {
        this.toast.success('Your offer has been submitted!');
        this.showOfferModal.set(false);
        this.submitting.set(false);
        this.offerForm.reset();
      },
      error: (err) => {
        this.toast.error(err?.error?.message ?? 'Failed to submit offer.');
        this.submitting.set(false);
      },
    });
  }

  // Admin: Approve
  approveListing(): void {
    this.submitting.set(true);
    this.listingsService.approve(this.listing()!.id).subscribe({
      next: () => { this.toast.success('Listing approved.'); this.reload(); },
      error: (err) => { this.toast.error(err?.error?.message ?? 'Failed.'); this.submitting.set(false); },
    });
  }

  // Admin: Reject
  rejectListing(): void {
    if (this.rejectForm.invalid) { this.rejectForm.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.listingsService.reject(this.listing()!.id, { reason: this.rejectForm.value.reason! }).subscribe({
      next: () => { this.toast.success('Listing rejected.'); this.showRejectModal.set(false); this.reload(); },
      error: (err) => { this.toast.error(err?.error?.message ?? 'Failed.'); this.submitting.set(false); },
    });
  }

  // Deactivate
  deactivateListing(): void {
    this.submitting.set(true);
    this.listingsService.deactivate(this.listing()!.id).subscribe({
      next: () => { this.toast.success('Listing deactivated.'); this.showDeactivateModal.set(false); this.reload(); },
      error: (err) => { this.toast.error(err?.error?.message ?? 'Failed.'); this.submitting.set(false); },
    });
  }

  // Mark as sold
  markSold(): void {
    this.submitting.set(true);
    this.listingsService.markAsSold(this.listing()!.id).subscribe({
      next: () => { this.toast.success('Listing marked as sold.'); this.reload(); },
      error: (err) => { this.toast.error(err?.error?.message ?? 'Failed.'); this.submitting.set(false); },
    });
  }

  // Report listing
  reportListing(): void {
    if (this.reportForm.invalid) { this.reportForm.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.reportingService.reportListing({ carListingId: this.listing()!.id, ...this.reportForm.value }).subscribe({
      next: () => { this.toast.success('Report submitted.'); this.showReportModal.set(false); this.submitting.set(false); this.reportForm.reset(); },
      error: (err) => { this.toast.error(err?.error?.message ?? 'Failed.'); this.submitting.set(false); },
    });
  }

  private reload(): void {
    this.submitting.set(false);
    const id = this.listing()!.id;
    this.listingsService.getById(id).subscribe((data) => this.listing.set(data));
  }

  isOwner(): boolean {
    return this.listing()?.seller?.id === this.authState.currentUser()?.id;
  }
}
