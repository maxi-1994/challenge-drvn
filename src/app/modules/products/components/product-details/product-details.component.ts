import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductsService } from '../../services/products.service';
import { Subscription } from 'rxjs';
import { ProductDetails, ProductUpdateBody } from '../../utils/products.model';
import { CurrencyService } from '../../../../core/services/currency.service';
import { StockPipe } from '../../../../shared/pipes/stock.pipe';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { PriceWithDiscountPipe } from '../../../../shared/pipes/pricewithdiscount.pipe';
import { MessageComponent } from '../../../../shared/components/message/message.component';
import Swal, { SweetAlertOptions } from 'sweetalert2'
import { ERROR_PRODUCT_DETAILS, ERROR_PRODUCT_UPDATE, SUCCESS_PRODUCT_UPDATE } from '../../utils/messages.constants';

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
    MatProgressSpinnerModule,
    MessageComponent
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
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
    title: this.fb.control<string>('', Validators.required),
    price: this.fb.control<number>(0, Validators.required),
    stock: this.fb.control<number>(0, Validators.required),
    description: this.fb.control<string>('', Validators.required),
  });

  public isLoading = signal<boolean>(true);
  public error = signal<string | null>(null);

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
            });
            this.isLoading.set(false);
          },
          error: (error) => {
            console.error('ERROR: ', error);
            this.error.set(ERROR_PRODUCT_DETAILS);
            this.isLoading.set(false);
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
    this.isLoading.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const productId = this.productId();
    const updatedProduct: ProductUpdateBody = {
      title: this.form.value.title!,
      stock: this.form.value.stock!,
      price: this.form.value.price!,
      description: this.form.value.description!
    };

    this.productsService.updateProduct(updatedProduct, productId)
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.isEditing.set(false);
          Swal.fire(SUCCESS_PRODUCT_UPDATE);
        },
        error: (error) => {
          console.error('error: ', error);
          this.isLoading.set(false);
          this.isEditing.set(false);
          Swal.fire(ERROR_PRODUCT_UPDATE);
        }
      });
  }

  onBack(): void {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.routeSubcription.unsubscribe();
  }
}
