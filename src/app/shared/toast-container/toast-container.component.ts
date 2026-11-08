import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'cb-toast-container',
  standalone: true,
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 9999">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="toast show align-items-center border-0 mb-2"
          [class]="toastClass(toast.type)"
          role="alert"
        >
          <div class="d-flex">
            <div class="toast-body d-flex align-items-start gap-2">
              <i [class]="'bi ' + toastIcon(toast.type) + ' fs-5 flex-shrink-0'"></i>
              <div>
                @if (toast.title) {
                  <div class="fw-semibold small">{{ toast.title }}</div>
                }
                <div class="small">{{ toast.message }}</div>
              </div>
            </div>
            <button
              type="button"
              class="btn-close btn-close-white me-2 m-auto"
              (click)="toastService.dismiss(toast.id)"
            ></button>
          </div>
        </div>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);

  toastClass(type: string): string {
    const map: Record<string, string> = {
      success: 'bg-success text-white',
      error: 'bg-danger text-white',
      warning: 'bg-warning text-dark',
      info: 'bg-info text-dark',
    };
    return map[type] ?? 'bg-secondary text-white';
  }

  toastIcon(type: string): string {
    const map: Record<string, string> = {
      success: 'bi-check-circle-fill',
      error: 'bi-x-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      info: 'bi-info-circle-fill',
    };
    return map[type] ?? 'bi-bell-fill';
  }
}
