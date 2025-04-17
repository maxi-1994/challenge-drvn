import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StockPipe } from '../../../../shared/pipes/stock.pipe';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { ProductTable } from '../../utils/products.model';

@Component({
  selector: 'app-products-table',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, StockPipe, CurrencyFormatPipe],
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.scss'
})
export class ProductsTableComponent {
  @Input() products: ProductTable[] = [];
  @Input() columns: string[] = [];
  @Output() goToDetails = new EventEmitter<number>();

  @Input() length!: number;
  @Input() pageSize!: number;
  @Input() pageIndex!: number;
  @Output() pageChange = new EventEmitter<PageEvent>();
}
