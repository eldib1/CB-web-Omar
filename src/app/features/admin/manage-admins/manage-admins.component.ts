import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SuperAdminService } from '../../../core/services/super-admin.service';
import { AdminSummary } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { ToastService } from '../../../core/services/toast.service';
import { passwordStrengthValidator, passwordMatchValidator } from '../../../shared/validators/custom-validators';

@Component({
  selector: 'cb-manage-admins',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DatePipe, LoadingSpinnerComponent],
  templateUrl: './manage-admins.component.html'
})
export class ManageAdminsComponent implements OnInit {
  private superAdminSvc = inject(SuperAdminService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  readonly loading = signal(false);
  readonly creating = signal(false);
  readonly admins = signal<AdminSummary[]>([]);
  readonly adminToRemove = signal<AdminSummary | null>(null);
  readonly showCreateModal = signal(false);
  readonly showRemoveModal = signal(false);
  readonly showPassword = signal(false);

  readonly createForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), passwordStrengthValidator()]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordMatchValidator('password', 'confirmPassword') });

  ngOnInit() { this.loadAdmins(); }

  loadAdmins() {
    this.loading.set(true);
    this.superAdminSvc.getAllAdmins().subscribe({
      next: r => { this.admins.set(r.data); this.loading.set(false); },
      error: () => { this.loading.set(false); this.toast.error('Failed to load admins'); }
    });
  }

  openCreateModal() {
    this.createForm.reset();
    this.showCreateModal.set(true);
  }

  submitCreate() {
    if (this.createForm.invalid) { this.createForm.markAllAsTouched(); return; }
    this.creating.set(true);
    const { fullName, email, password } = this.createForm.value;
    this.superAdminSvc.createAdmin({ fullName: fullName!, email: email!, password: password! }).subscribe({
      next: () => {
        this.toast.success('Admin created successfully');
        this.creating.set(false);
        this.showCreateModal.set(false);
        this.loadAdmins();
      },
      error: () => { this.creating.set(false); this.toast.error('Failed to create admin'); }
    });
  }

  openRemoveModal(admin: AdminSummary) {
    this.adminToRemove.set(admin);
    this.showRemoveModal.set(true);
  }

  confirmRemove() {
    if (!this.adminToRemove()) return;
    this.superAdminSvc.removeAdmin(this.adminToRemove()!.id).subscribe({
      next: () => {
        this.toast.success('Admin removed');
        this.showRemoveModal.set(false);
        this.adminToRemove.set(null);
        this.loadAdmins();
      },
      error: () => this.toast.error('Failed to remove admin')
    });
  }

  hasError(field: string, error: string): boolean {
    const c = this.createForm.get(field);
    return !!(c?.hasError(error) && c.touched);
  }
}
