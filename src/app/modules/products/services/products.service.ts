import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { Product, ProductDetails, ProductResponse, ProductTable, ProductUpdateBody } from '../utils/products.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private baseUrl: string = environment.apiUrl;
  private getProductByIdUrl = `${this.baseUrl}products/`;
  private getCategoryListUrl = `${this.baseUrl}products/category-list`
  private updateProductUrl = `${this.baseUrl}products/`

  constructor(private http: HttpClient) { }

  getProducts(category: string | null, limit: number = 0, skip: number): Observable<{ products: ProductTable[], total: number }> {
    let getProductsUrl = category
    ? `${this.baseUrl}products/category/${category}`
    : `${this.baseUrl}products`;

    return this.http.get<ProductResponse>(`${getProductsUrl}?limit=${limit}&skip=${skip}`)
      .pipe(
        map((res: ProductResponse) => ({
          products: res.products.map(product => ({
            id: product.id,
            thumbnail: product.thumbnail,
            title: product.title,
            brand: product.brand,
            price: product.price,
            stock: product.stock,
            rating: product.rating
          })),
          total: res.total
        }))
      );
  }

  getProductById(productId: string): Observable<ProductDetails> {
    return this.http.get<Product>(this.getProductByIdUrl + productId)
      .pipe(
        map((product: Product) => {
          return {
            id: product.id,
            title: product.title,
            brand: product.brand,
            price: product.price,
            stock: product.stock,
            rating: product.rating,
            discountPercentage: product.discountPercentage,
            description: product.description,
            images: product.images
          }
        })
      );
  }

  getCategoryList(): Observable<string[]> {
    return this.http.get<string[]>(this.getCategoryListUrl);
  }

  searchProducts(query: string, limit: number = 0, skip: number): Observable<{ products: ProductTable[], total: number }> {
    const url = `${this.baseUrl}products/search?q=${query}&limit=${limit}&skip=${skip}`;
  
    return this.http.get<ProductResponse>(url).pipe(
      map((res: ProductResponse) => ({
        products: res.products.map(product => ({
          id: product.id,
          thumbnail: product.thumbnail,
          title: product.title,
          brand: product.brand,
          price: product.price,
          stock: product.stock,
          rating: product.rating
        })),
        total: res.total
      }))
    );
  }

  updateProduct(product: ProductUpdateBody, productId: string): Observable<Product> {
    return this.http.put<Product>(`${this.updateProductUrl}${productId}`, product);
  }
}
