import { Component, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawerContainer, MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon'
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../../modules/products/services/products.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, MatButtonModule, MatDrawerContainer, MatDrawer, MatSidenavModule, MatIconModule, MatListModule, MatExpansionModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private productsService = inject(ProductsService);
  public categories = signal<string[]>([]);

  constructor() {
    effect(() => {
      this.productsService.getCategoryList().subscribe((categoryList) => {
        this.categories.set(categoryList);
      });
    });
  }
}
