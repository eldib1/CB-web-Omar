import { Component, input, output } from '@angular/core';

@Component({
  selector: 'cb-pagination',
  standalone: true,
  template: `
    @if (totalPages() > 1) {
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center mb-0">
          <li class="page-item" [class.disabled]="currentPage() === 1">
            <button class="page-link" (click)="pageChange.emit(currentPage() - 1)">
              <i class="bi bi-chevron-left"></i>
            </button>
          </li>
          @for (page of pages(); track page) {
            <li class="page-item" [class.active]="page === currentPage()">
              <button class="page-link" (click)="pageChange.emit(page)">{{ page }}</button>
            </li>
          }
          <li class="page-item" [class.disabled]="currentPage() === totalPages()">
            <button class="page-link" (click)="pageChange.emit(currentPage() + 1)">
              <i class="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    }
  `,
})
export class PaginationComponent {
  readonly currentPage = input.required<number>();
  readonly totalCount = input.required<number>();
  readonly pageSize = input<number>(10);

  readonly pageChange = output<number>();

  totalPages(): number {
    return Math.ceil(this.totalCount() / this.pageSize());
  }

  pages(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;
    const range: number[] = [];
    for (
      let i = Math.max(1, current - delta);
      i <= Math.min(total, current + delta);
      i++
    ) {
      range.push(i);
    }
    return range;
  }
}
