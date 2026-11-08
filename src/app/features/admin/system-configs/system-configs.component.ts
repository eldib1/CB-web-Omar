import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services';
import { SystemConfig } from '../../../core/models';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'cb-system-configs',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './system-configs.component.html'
})
export class SystemConfigsComponent implements OnInit {
  private adminSvc = inject(AdminService);
  private toast = inject(ToastService);

  readonly loading = signal(true);
  readonly configs = signal<SystemConfig[]>([]);
  readonly editingKey = signal<string | null>(null);
  readonly editValue = signal('');
  readonly saving = signal(false);

  ngOnInit() { this.loadConfigs(); }

  loadConfigs() {
    this.loading.set(true);
    this.adminSvc.getAllConfigs().subscribe({
      next: r => { this.configs.set(r.data); this.loading.set(false); },
      error: () => { this.loading.set(false); this.toast.error('Failed to load configurations'); }
    });
  }

  startEdit(config: SystemConfig) {
    this.editingKey.set(config.key);
    this.editValue.set(config.value);
  }

  cancelEdit() {
    this.editingKey.set(null);
    this.editValue.set('');
  }

  saveConfig(config: SystemConfig) {
    this.saving.set(true);
    this.adminSvc.updateConfig(config.key, { value: this.editValue() }).subscribe({
      next: () => {
        this.toast.success('Configuration updated');
        this.cancelEdit();
        this.loadConfigs();
        this.saving.set(false);
      },
      error: () => { this.saving.set(false); this.toast.error('Failed to update configuration'); }
    });
  }

  getValueTypeIcon(valueType: string): string {
    switch (valueType?.toLowerCase()) {
      case 'boolean': return 'bi-toggle-on';
      case 'number': return 'bi-123';
      case 'string': return 'bi-text-left';
      default: return 'bi-gear';
    }
  }
}
