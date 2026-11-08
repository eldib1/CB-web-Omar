import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'auCurrency', standalone: true })
export class AuCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
    }).format(value);
  }
}
