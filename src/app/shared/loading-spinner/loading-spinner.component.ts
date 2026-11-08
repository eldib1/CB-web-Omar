import { Component, input } from '@angular/core';

@Component({
  selector: 'cb-loading-spinner',
  standalone: true,
  template: `
    <div class="d-flex justify-content-center align-items-center" [style.min-height]="minHeight()">
      <div class="text-center">
        <div class="spinner-border text-warning" role="status" [class]="sizeClass()">
          <span class="visually-hidden">Loading...</span>
        </div>
        @if (message()) {
          <div class="mt-2 text-muted small">{{ message() }}</div>
        }
      </div>
    </div>
  `,
})
export class LoadingSpinnerComponent {
  readonly message = input<string>('');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly minHeight = input<string>('200px');

  sizeClass(): string {
    return this.size() === 'sm' ? 'spinner-border-sm' : '';
  }
}
