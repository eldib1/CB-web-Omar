import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'cb-file-upload',
  standalone: true,
  template: `
    <div
      class="file-drop-zone border-2 border-dashed rounded-3 p-4 text-center"
      [class.drag-over]="isDragging()"
      [class.border-danger]="hasError()"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave()"
      (drop)="onDrop($event)"
    >
      <i [class]="'bi ' + icon() + ' fs-1 text-muted d-block mb-2'"></i>
      <p class="mb-1 fw-semibold">{{ label() }}</p>
      <p class="small text-muted mb-3">{{ hint() }}</p>
      <label class="btn btn-outline-warning btn-sm">
        Browse Files
        <input
          type="file"
          class="d-none"
          [accept]="accept()"
          [multiple]="multiple()"
          (change)="onFileSelect($event)"
        />
      </label>

      @if (selectedFiles().length > 0) {
        <div class="mt-3 text-start">
          @for (file of selectedFiles(); track file.name) {
            <div class="d-flex align-items-center gap-2 py-1 px-2 bg-light rounded mb-1">
              <i class="bi bi-file-earmark text-warning"></i>
              <span class="small text-truncate flex-grow-1">{{ file.name }}</span>
              <span class="small text-muted">{{ formatSize(file.size) }}</span>
              <button class="btn btn-link btn-sm p-0 text-danger" (click)="removeFile(file)">
                <i class="bi bi-x"></i>
              </button>
            </div>
          }
        </div>
      }

      @if (hasError()) {
        <div class="text-danger small mt-2">{{ errorMsg() }}</div>
      }
    </div>
  `,
  styles: [`
    .file-drop-zone {
      border-color: #26262e;
      transition: border-color 0.2s, background 0.2s;
      cursor: pointer;
      &.drag-over {
        border-color: var(--bs-warning) !important;
        background: rgba(255, 193, 7, 0.05);
      }
    }
  `],
})
export class FileUploadComponent {
  readonly label = input<string>('Drop files here');
  readonly hint = input<string>('or click to browse');
  readonly accept = input<string>('*/*');
  readonly multiple = input<boolean>(false);
  readonly icon = input<string>('bi-cloud-arrow-up');
  readonly maxFiles = input<number>(10);
  readonly maxSizeMb = input<number>(10);
  readonly required = input<boolean>(false);

  readonly filesSelected = output<File[]>();

  readonly selectedFiles = signal<File[]>([]);
  readonly isDragging = signal(false);
  readonly hasError = signal(false);
  readonly errorMsg = signal('');

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(): void {
    this.isDragging.set(false);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragging.set(false);
    const files = Array.from(e.dataTransfer?.files ?? []);
    this.processFiles(files);
  }

  onFileSelect(e: Event): void {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    this.processFiles(files);
    input.value = '';
  }

  removeFile(file: File): void {
    this.selectedFiles.update((prev) => prev.filter((f) => f !== file));
    this.filesSelected.emit(this.selectedFiles());
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  private processFiles(files: File[]): void {
    this.hasError.set(false);
    const maxBytes = this.maxSizeMb() * 1024 * 1024;
    const oversized = files.filter((f) => f.size > maxBytes);
    if (oversized.length > 0) {
      this.hasError.set(true);
      this.errorMsg.set(`File(s) exceed ${this.maxSizeMb()}MB limit.`);
      return;
    }
    if (this.multiple()) {
      const combined = [...this.selectedFiles(), ...files].slice(0, this.maxFiles());
      this.selectedFiles.set(combined);
    } else {
      this.selectedFiles.set(files.slice(0, 1));
    }
    this.filesSelected.emit(this.selectedFiles());
  }
}
