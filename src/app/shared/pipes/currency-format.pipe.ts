import { inject, Pipe, PipeTransform } from '@angular/core';
import { CurrencyService } from '../../core/services/currency.service';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  standalone: true,
  name: 'currencyFormat',
  pure: false
})
export class CurrencyFormatPipe implements PipeTransform {
  private currencyService = inject(CurrencyService);
  private currencyPipe = new CurrencyPipe('en-US');

  transform(value: number): string {
    const currentCurrency = this.currencyService.currency();
    const converted = currentCurrency === 'EUR' ? value / 1.08 : value;
    return this.currencyPipe.transform(converted, currentCurrency, 'symbol-narrow')!;
  }

}
