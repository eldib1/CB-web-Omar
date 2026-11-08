import { Directive, HostListener, HostBinding, input, output } from '@angular/core';

@Directive({
  selector: '[cbDragDrop]',
  standalone: true,
})
export class DragDropDirective {
  readonly filesDropped = output<File[]>();

  @HostBinding('class.drag-over') isDragOver = false;

  @HostListener('dragover', ['$event'])
  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver = true;
  }

  @HostListener('dragleave')
  onDragLeave(): void {
    this.isDragOver = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver = false;
    const files = Array.from(e.dataTransfer?.files ?? []);
    this.filesDropped.emit(files);
  }
}
