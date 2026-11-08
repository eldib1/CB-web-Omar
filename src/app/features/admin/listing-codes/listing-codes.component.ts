import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../../core/services';
import { ListingCode } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'cb-listing-codes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DatePipe,
    LoadingSpinnerComponent, StatusBadgeComponent, PaginationComponent],
  templateUrl: './listing-codes.component.html'
})
export class ListingCodesComponent implements OnInit {
  private adminSvc = inject(AdminService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  readonly activeTab = signal<'all' | 'unused'>('all');
  readonly loading = signal(false);
  readonly generating = signal(false);
  readonly codes = signal<ListingCode[]>([]);
  readonly page = signal(1);
  readonly totalCount = signal(0);
  readonly pageSize = 25;

  readonly generateForm = this.fb.group({
    count: [10, [Validators.required, Validators.min(1), Validators.max(100)]]
  });

  ngOnInit() { this.loadCodes(); }

  setTab(tab: 'all' | 'unused') {
    this.activeTab.set(tab);
    this.page.set(1);
    this.loadCodes();
  }

  loadCodes() {
    this.loading.set(true);
    const obs = this.activeTab() === 'unused'
      ? this.adminSvc.getUnusedCodes()
      : this.adminSvc.getAllCodes();
    obs.subscribe({
      next: r => { this.codes.set(r.data); this.totalCount.set(r.data.length); this.loading.set(false); },
      error: () => { this.loading.set(false); this.toast.error('Failed to load codes'); }
    });
  }

  generateCodes() {
    if (this.generateForm.invalid) return;
    this.generating.set(true);
    this.adminSvc.generateCodes({ count: this.generateForm.value.count! }).subscribe({
      next: () => {
        this.toast.success(`Generated ${this.generateForm.value.count} new listing codes`);
        this.generating.set(false);
        this.loadCodes();
      },
      error: () => { this.generating.set(false); this.toast.error('Failed to generate codes'); }
    });
  }

  onPageChange(page: number) { this.page.set(page); this.loadCodes(); }
}
