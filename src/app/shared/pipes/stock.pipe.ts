import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'stockColor'
})
export class StockPipe implements PipeTransform {

  transform(stock: number): string {
    if (stock === 0) return 'red';
    if (stock > 0 && stock < 50) return 'orange';
    return 'steelblue';
  }

}
