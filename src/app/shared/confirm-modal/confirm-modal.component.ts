import { Component, input, output } from '@angular/core';

@Component({
  selector: 'cb-confirm-modal',
  standalone: true,
  template: `
    <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title">{{ title() }}</h5>
            <button type="button" class="btn-close" (click)="cancel.emit()"></button>
          </div>
          <div class="modal-body">
            <p class="text-muted mb-0">{{ message() }}</p>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" (click)="cancel.emit()">Cancel</button>
            <button type="button" [class]="'btn btn-' + confirmVariant()" (click)="confirm.emit()">
              {{ confirmText() }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmModalComponent {
  readonly title = input<string>('Confirm Action');
  readonly message = input<string>('Are you sure you want to proceed?');
  readonly confirmText = input<string>('Confirm');
  readonly confirmVariant = input<string>('danger');

  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
