import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService, ListingsService } from '../../../core/services';
import { CarListingSummary } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { AuCurrencyPipe } from '../../../shared/pipes/au-currency.pipe';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'cb-listing-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, DatePipe, AuCurrencyPipe,
    LoadingSpinnerComponent, StatusBadgeComponent, PaginationComponent],
  templateUrl: './listing-management.component.html'
})
export class ListingManagementComponent implements OnInit {
  private listingsSvc = inject(ListingsService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  readonly activeTab = signal<'all' | 'pending'>('all');
  readonly loading = signal(false);
  readonly listings = signal<CarListingSummary[]>([]);
  readonly page = signal(1);
  readonly totalCount = signal(0);
  readonly pageSize = 20;
  readonly searchText = signal('');
  readonly statusFilter = signal('');

  readonly showRejectModal = signal(false);
  readonly selectedListingId = signal<number | null>(null);
  readonly rejectForm = this.fb.group({ reason: ['', Validators.required] });

  ngOnInit() { this.loadListings(); }

  setTab(tab: 'all' | 'pending') {
    this.activeTab.set(tab);
    this.page.set(1);
    this.loadListings();
  }

  loadListings() {
    this.loading.set(true);
    const params: any = {
      page: this.page(),
      pageSize: this.pageSize
    };
    if (this.activeTab() === 'pending') params.status = 'PendingApproval';
    else if (this.statusFilter()) params.status = this.statusFilter();
    if (this.searchText()) params.search = this.searchText();

    this.listingsSvc.search(params).subscribe({
      next: r => {
        this.listings.set(r.data?.items ?? []);
        this.totalCount.set(r.data?.totalCount ?? 0);
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); this.toast.error('Failed to load listings'); }
    });
  }

  approve(id: number) {
    this.listingsSvc.approve(id).subscribe({
      next: () => { this.toast.success('Listing approved'); this.loadListings(); },
      error: () => this.toast.error('Failed to approve listing')
    });
  }

  openRejectModal(id: number) {
    this.selectedListingId.set(id);
    this.rejectForm.reset();
    this.showRejectModal.set(true);
  }

  submitReject() {
    if (this.rejectForm.invalid) return;
    this.listingsSvc.reject(this.selectedListingId()!, { reason: this.rejectForm.value.reason! }).subscribe({
      next: () => {
        this.toast.success('Listing rejected');
        this.showRejectModal.set(false);
        this.loadListings();
      },
      error: () => this.toast.error('Failed to reject listing')
    });
  }

  deactivate(id: number) {
    this.listingsSvc.deactivate(id).subscribe({
      next: () => { this.toast.success('Listing deactivated'); this.loadListings(); },
      error: () => this.toast.error('Failed to deactivate listing')
    });
  }

  markSold(id: number) {
    this.listingsSvc.markAsSold(id).subscribe({
      next: () => { this.toast.success('Listing marked as sold'); this.loadListings(); },
      error: () => this.toast.error('Failed to mark listing as sold')
    });
  }

  onPageChange(page: number) { this.page.set(page); this.loadListings(); }
}
