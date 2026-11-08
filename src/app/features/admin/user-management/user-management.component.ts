import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { ReportingService } from '../../../core/services/reporting.service';
import { UserSummary, UserVerification, UserReport } from '../../../core/models';
import { ReportAction } from '../../../core/models/enums';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'cb-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DatePipe, LoadingSpinnerComponent, StatusBadgeComponent, PaginationComponent],
  templateUrl: './user-management.component.html'
})
export class UserManagementComponent implements OnInit {
  private adminSvc = inject(AdminService);
  private reportingSvc = inject(ReportingService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  readonly activeTab = signal<'all' | 'pending' | 'reports'>('all');
  readonly loading = signal(false);
  readonly allUsers = signal<UserSummary[]>([]);
  readonly pendingVers = signal<UserVerification[]>([]);
  readonly reports = signal<UserReport[]>([]);
  readonly selectedVerification = signal<UserVerification | null>(null);
  readonly verificationLoading = signal(false);
  readonly selectedUserId = signal<number | null>(null);
  readonly selectedReport = signal<UserReport | null>(null);
  readonly rejectForm = this.fb.group({ reason: ['', Validators.required] });
  readonly suspendForm = this.fb.group({ reason: ['', Validators.required] });
  readonly reviewForm = this.fb.group({
    action: [ReportAction.Warning as ReportAction, Validators.required],
    notes: ['', Validators.required]
  });
  readonly assignCodesCount = signal(1);
  readonly ReportAction = ReportAction;
  readonly pageSize = 20;

  get allUsersTotal() { return this.allUsers().length; }
  get pendingTotal() { return this.pendingVers().length; }
  get reportsTotal() { return this.reports().length; }

  ngOnInit() { this.loadAllUsers(); }

  setTab(tab: 'all' | 'pending' | 'reports') {
    this.activeTab.set(tab);
    if (tab === 'pending' && this.pendingVers().length === 0) this.loadPending();
    if (tab === 'reports' && this.reports().length === 0) this.loadReports();
  }

  loadAllUsers() {
    this.loading.set(true);
    this.adminSvc.getAllUsers().subscribe({
      next: r => { this.allUsers.set(r.data); this.loading.set(false); },
      error: () => { this.loading.set(false); this.toast.error('Failed to load users'); }
    });
  }

  loadPending() {
    this.loading.set(true);
    this.adminSvc.getPendingVerifications().subscribe({
      next: r => { this.pendingVers.set(r.data); this.loading.set(false); },
      error: () => { this.loading.set(false); this.toast.error('Failed to load pending verifications'); }
    });
  }

  loadReports() {
    this.loading.set(true);
    this.reportingSvc.getPendingReports().subscribe({
      next: r => { this.reports.set(r.data); this.loading.set(false); },
      error: () => { this.loading.set(false); this.toast.error('Failed to load reports'); }
    });
  }

  viewVerification(userId: number) {
    this.verificationLoading.set(true);
    this.adminSvc.getUserForVerification(userId).subscribe({
      next: v => { this.selectedVerification.set(v); this.verificationLoading.set(false); },
      error: () => { this.verificationLoading.set(false); this.toast.error('Failed to load verification'); }
    });
  }

  approveUser(userId: number) {
    this.adminSvc.approveUser({ userId }).subscribe({
      next: () => { this.toast.success('User approved'); this.loadPending(); this.loadAllUsers(); this.selectedVerification.set(null); },
      error: () => this.toast.error('Failed to approve user')
    });
  }

  openRejectModal(userId: number) { this.selectedUserId.set(userId); this.rejectForm.reset(); }

  submitReject() {
    if (this.rejectForm.invalid) return;
    this.adminSvc.rejectUser({ userId: this.selectedUserId()!, rejectionReason: this.rejectForm.value.reason! }).subscribe({
      next: () => { this.toast.success('User rejected'); this.loadPending(); this.loadAllUsers(); this.selectedVerification.set(null); },
      error: () => this.toast.error('Failed to reject user')
    });
  }

  openSuspendModal(userId: number) { this.selectedUserId.set(userId); this.suspendForm.reset(); }

  submitSuspend() {
    if (this.suspendForm.invalid) return;
    this.adminSvc.suspendUser(this.selectedUserId()!).subscribe({
      next: () => { this.toast.success('User suspended'); this.loadAllUsers(); },
      error: () => this.toast.error('Failed to suspend user')
    });
  }

  openCodesModal(userId: number) { this.selectedUserId.set(userId); this.assignCodesCount.set(1); }

  submitAssignCodes() {
    this.adminSvc.assignListingCodes({ userId: this.selectedUserId()!, count: this.assignCodesCount() }).subscribe({
      next: () => this.toast.success(this.assignCodesCount() + ' code(s) assigned'),
      error: () => this.toast.error('Failed to assign codes')
    });
  }

  openReviewReportModal(report: UserReport) { this.selectedReport.set(report); this.reviewForm.reset({ action: ReportAction.Warning, notes: '' }); }

  submitReviewReport() {
    if (this.reviewForm.invalid) return;
    this.reportingSvc.reviewReport({ reportId: this.selectedReport()!.id, action: this.reviewForm.value.action as ReportAction, notes: this.reviewForm.value.notes! }).subscribe({
      next: () => { this.toast.success('Report reviewed'); this.loadReports(); },
      error: () => this.toast.error('Failed to review report')
    });
  }
}
