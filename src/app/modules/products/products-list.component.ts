import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ProductsTableComponent } from './components/products-table/products-table.component';
import { SearchFilterComponent } from '../../shared/components/search-filter/search-filter.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyService } from '../../core/services/currency.service';
import { ProductsService } from './services/products.service';
import { ProductTable } from './utils/products.model';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { CapitalizePipe } from '../../shared/pipes/capitalize.pipe';
import { TABLE_COLUMNS } from './utils/table.constants';
import { MessageComponent } from '../../shared/components/message/message.component';
import { ERROR_PRODUCTS_LIST, NO_PRODUCT_FOUND } from './utils/messages.constants';

@Component({
  selector: 'app-products-list',
  imports: [
    CommonModule, 
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    ProductsTableComponent, 
    SearchFilterComponent,
    MessageComponent,
    CapitalizePipe, 
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productsSevice = inject(ProductsService);
  public currencyService = inject(CurrencyService);
  private routeSubscription: Subscription;

  public category = signal<string | null>(null);
  public products = signal<ProductTable[]>([]);
  public isLoading = signal<boolean>(true);
  public error = signal<string | null>(null);

  public tableColumns = TABLE_COLUMNS;
  public total = signal<number>(0);
  public pageIndex = signal<number>(0);
  public pageSize = signal<number>(10);

  public search = signal<string>('');
  public noProductsFoundMessage: string = NO_PRODUCT_FOUND;

  constructor() {
    this.routeSubscription = this.route.paramMap.subscribe((params: ParamMap) => {
      this.category.set(params.get('category'));
    });
  
    effect(() => {
      const category = this.category();
      const skip = this.pageIndex() * this.pageSize();
      const limit = this.pageSize();

      const search = this.search();

      const productsRequest$ = search
      ? this.productsSevice.searchProducts(search, limit, skip)
      : this.productsSevice.getProducts(category, limit, skip);

      productsRequest$.subscribe({
        next: (res) => {
          this.products.set(res.products);
          this.total.set(res.total)
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('ERROR: ', error);
          this.error.set(ERROR_PRODUCTS_LIST);
          this.isLoading.set(false);
        }
      });
    });
  }

  onSearchChange(query: string): void {
    this.pageIndex.set(0);
    this.search.set(query);
  }
  
  onCurrencyToggle(): void {
    this.currencyService.toggleCurrency();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onGoToDetails(productId: number): void {
    this.router.navigate(['/product-detail', productId]);
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}