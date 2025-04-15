import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon'
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../../modules/products/services/products.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, MatButtonModule, MatSidenavModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private productsService = inject(ProductsService);
  categories = signal<string[]>([]);

  constructor() {
    effect(() => {
      this.productsService.getCategoryList().subscribe((categoryList) => {
        this.categories.set(categoryList);
      });
    });
  }
}
