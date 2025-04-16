import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Component, effect, inject, signal, OnDestroy, computed } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ProductsService } from './services/products.service';
import { ProductTable } from './utils/products.model';
import { Subscription } from 'rxjs';
import { StockPipe } from '../../shared/pipes/stock.pipe';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';
import { CurrencyService } from '../../core/services/currency.service';

@Component({
  selector: 'app-products-list',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule, MatIconModule, StockPipe, CurrencyFormatPipe],
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

  public tableColumns = ['image', 'title', 'brand', 'price', 'stock', 'rating', 'actions'];
  public total = signal(0);
  public pageIndex = signal(0);
  public pageSize = signal(10);
  readonly pagedProducts = computed(() => this.products());

  public search = signal('');

  constructor() {
    this.routeSubscription = this.route.paramMap.subscribe((params: ParamMap) => {
      this.category.set(params.get('category'));
    });
  
    effect(() => {
      const category = this.category();
      const skip = this.pageIndex() * this.pageSize();
      const limit = this.pageSize();

      const search = this.search();

      const request$ = search
      ? this.productsSevice.searchProducts(search, limit, skip)
      : this.productsSevice.getProducts(category, limit, skip);

      request$.subscribe({
        next: (res) => {
          this.products.set(res.products);
          this.total.set(res.total)
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('ERROR: ', error);
          this.error.set('Hubo un problema al cargar los datos');
          this.isLoading.set(false);
        }
      });
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onCurrencyToggle() {
    this.currencyService.toggleCurrency();
  }

  onSearchChange(event: any) {
    this.pageIndex.set(0);
    this.search.set(event.target.value);
  }

  onGoToDetails(productId: number): void {
    this.router.navigate(['/product-detail', productId]);
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}