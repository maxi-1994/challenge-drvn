import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Subscription } from 'rxjs';
import { ProductDetails } from '../../utils/products.model';
import { CurrencyService } from '../../../../core/services/currency.service';
import { StockPipe } from '../../../../shared/pipes/stock.pipe';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, CurrencyFormatPipe, StockPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnDestroy {
  /* 
    - add loading
    - add error message

    - add edit functionality (name, price, stock and descrption)
  */
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  private currencyService = inject(CurrencyService);
  private routeSubcription: Subscription;

  public productId = signal<string>('');
  public product = signal<ProductDetails | null>(null);
  public currency = signal<'USD' | 'EUR'>(this.currencyService.getCurrency());

  constructor() {
    this.routeSubcription = this.route.paramMap.subscribe((params: ParamMap) => {
      this.productId.set(params.get('id') ?? '');
    });

    effect(() => {
      // TODO: Add isLoding and error
      const productId = this.productId();

      this.productsService.getProductById(productId)
        .subscribe({
          next: (productResp: ProductDetails) => {
            this.product.set(productResp);
            console.log('product signal: ', this.product());
          },
          error: (error) => {
            console.error('ERROR: ', error);
          }
        })

    });
  }

  ngOnDestroy(): void {
    this.routeSubcription.unsubscribe();
  }
}
