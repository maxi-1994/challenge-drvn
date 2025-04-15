import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProductsService } from './services/products.service';
import { ProductTable } from './utils/products.model';

@Component({
  selector: 'app-products-list',
  imports: [CommonModule, MatTableModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent {
  private route = inject(ActivatedRoute);
  private productsSevice = inject(ProductsService);

  public category = signal<string | null>(null);
  public productList = signal<ProductTable[]>([]);

  public tableColumns = ['title', 'brand', 'price', 'stock', 'rating'];

  constructor() {
    effect(() => {
      this.route.paramMap.subscribe((params: ParamMap) => {
        this.category.set(params.get('category'));
      });
    });

    effect(() => {
      const currentCategory = this.category();
      console.log('currentCategory', currentCategory);

      if (!currentCategory) {
        this.productsSevice.getAllProducts().subscribe((products) => {
          this.productList.set(products);
        });
      } else {
        this.productsSevice.getProductsByCategory(currentCategory)
        .subscribe((products) => {
          this.productList.set(products);
        });
      }
    });
  }
}
