import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private readonly key = 'selectedCurrency';
  public currency = signal<'USD' | 'EUR'>(this.getCurrency());

  getCurrency(): 'USD' | 'EUR' {
    return (localStorage.getItem(this.key) as 'USD' | 'EUR') || 'USD';
  }

  setCurrency(currency: 'USD' | 'EUR'): void {
    localStorage.setItem(this.key, currency);
  }

  toggleCurrency(): void {
    const newCurrency = this.currency() === 'USD' ? 'EUR' : 'USD';
    this.currency.set(newCurrency);
    this.setCurrency(newCurrency);
  }
}
