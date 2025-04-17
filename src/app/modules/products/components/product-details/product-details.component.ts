import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Subscription } from 'rxjs';
import { ProductDetails, ProductUpdateBody } from '../../utils/products.model';
import { CurrencyService } from '../../../../core/services/currency.service';
import { StockPipe } from '../../../../shared/pipes/stock.pipe';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { PriceWithDiscountPipe } from '../../../../shared/pipes/pricewithdiscount.pipe';

@Component({
  selector: 'app-product-details',
  imports: [
    CommonModule, 
    MatButtonModule, 
    CurrencyFormatPipe, 
    StockPipe,
    PriceWithDiscountPipe,
    ReactiveFormsModule, 
    MatSnackBarModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  private currencyService = inject(CurrencyService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private routeSubcription: Subscription;

  public productId = signal<string>('');
  public product = signal<ProductDetails | null>(null);

  public currency = signal<'USD' | 'EUR'>(this.currencyService.getCurrency());

  public isEditing = signal(false);
  public form = this.fb.group({
    title: ['', Validators.required],
    price: [0, Validators.required],
    stock: [0, Validators.required],
    description: ['', Validators.required],
  });

  constructor() {
    this.routeSubcription = this.route.paramMap.subscribe((params: ParamMap) => {
      this.productId.set(params.get('id') ?? '');
    });

    effect(() => {
      const productId = this.productId();

      this.productsService.getProductById(productId)
        .subscribe({
          next: (productResp: ProductDetails) => {
            this.product.set(productResp);
            this.form.patchValue({
              title: productResp.title,
              price: productResp.price,
              stock: productResp.stock,
              description: productResp.description
            })
          },
          error: (error) => {
            console.error('ERROR: ', error);
          }
        })

    });
  }

  onEnableEdit(): void {
    this.isEditing.set(true);
  }

  onCancelEdit(): void {
    this.isEditing.set(false);
    const product = this.product();
    if (product) {
      this.form.patchValue({
        title: product.title,
        price: product.price,
        stock: product.stock,
        description: product.description
      });
    }
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('form value: ', this.form.value);

    // const productId = this.productId();
    // const updatedProductBody: ProductUpdateBody = this.form.value;
    // this.productsService.updateProduct(updatedProductBody, productId)
    //   .subscribe({
    //     next: (res) => {
    //       console.log('saved response ', res);
    //       // Add snackbar
    //     },
    //     error: (error) => {
    //       console.error('error: ', error);
    //     }
    //   });
  }

  ngOnDestroy(): void {
    this.routeSubcription.unsubscribe();
  }
}
