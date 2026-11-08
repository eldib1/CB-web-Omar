import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ListingsService } from '../../../core/services/listings.service';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { FileUploadComponent } from '../../../shared/file-upload/file-upload.component';

@Component({
  selector: 'cb-create-listing',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FileUploadComponent],
  templateUrl: './create-listing.component.html',
})
export class CreateListingComponent {
  private readonly fb = inject(FormBuilder);
  private readonly listingsService = inject(ListingsService);
  private readonly adminService = inject(AdminService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly images = signal<File[]>([]);
  readonly documents = signal<File[]>([]);
  readonly videos = signal<File[]>([]);

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    make: ['', Validators.required],
    model: ['', Validators.required],
    year: [new Date().getFullYear(), [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)]],
    price: [null as number | null, [Validators.required, Validators.min(500)]],
    mileage: [null as number | null, [Validators.required, Validators.min(0)]],
    location: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(20)]],
    transmission: ['Automatic', Validators.required],
    fuelType: ['Petrol', Validators.required],
    bodyType: ['Sedan', Validators.required],
    color: ['', Validators.required],
    interiorColor: [''],
    vin: [''],
    listingCode: [''],
  });

  get f() { return this.form.controls; }

  years(): number[] {
    const current = new Date().getFullYear();
    return Array.from({ length: 35 }, (_, i) => current - i);
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.images().length === 0) { this.toast.error('Please upload at least one image.'); return; }
    if (this.documents().length === 0) { this.toast.error('Please upload at least one document.'); return; }

    this.loading.set(true);
    const { listingCode, ...rest } = this.form.value;
    this.listingsService.create(rest as any).subscribe({
      next: (res) => {
        const listingId = res.id;
        this.listingsService.uploadMedia(listingId, this.images(), this.documents(), this.videos()).subscribe({
          next: () => {
            this.listingsService.submitForApproval(listingId).subscribe({
              next: () => {
                this.toast.success('Your listing has been submitted for approval!');
                this.router.navigate(['/listings/my']);
              },
              error: () => { this.toast.success('Listing created. Submit for approval from My Listings.'); this.router.navigate(['/listings/my']); },
            });
          },
          error: () => { this.toast.warning('Listing created but media upload failed. Please retry.'); this.loading.set(false); },
        });
      },
      error: (err) => { this.toast.error(err?.error?.message ?? 'Failed to create listing.'); this.loading.set(false); },
    });
  }
}
