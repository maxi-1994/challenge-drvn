import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { Product, ProductResponse, ProductTable } from '../utils/products.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private baseUrl: string = environment.apiUrl;
  private getAllProductsUrl = `${this.baseUrl}products`;
  private getProductByIdUrl = `${this.baseUrl}products/`;
  private getCategoryListUrl = `${this.baseUrl}products/category-list`
  private getProductsByCategoryUrl = `${this.baseUrl}products/category/`
  private updateProductUrl = `${this.baseUrl}products/`

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<ProductTable[]> {
    // TODO: Add limit query param to pagination           -> devuelve productResponse
    // TODO: Add the searcher here? or create other method -> devuelve productResponse
    return this.http.get<ProductResponse>(this.getAllProductsUrl)
      .pipe(
        map((res: ProductResponse) => {
          return res.products.map(product => ({
            id: product.id,
            title: product.title,
            brand: product.brand,
            price: product.price,
            stock: product.stock,
            rating: product.rating
          }))
        })
      );
  }

  getProductById(productId: string): Observable<Product> {
    return this.http.get<Product>(this.getProductByIdUrl + productId);
  }

  getCategoryList(): Observable<string[]> {
    return this.http.get<string[]>(this.getCategoryListUrl);
  }
  
  getProductsByCategory(category: string | null): Observable<ProductTable[]> {
    // TODO: Check if I can use the getAllProducts method
    return this.http.get<ProductResponse>(this.getProductsByCategoryUrl + category)
    .pipe(
      map((res: ProductResponse) => {
        return res.products.map(product => ({
          id: product.id,
          title: product.title,
          brand: product.brand,
          price: product.price,
          stock: product.stock,
          rating: product.rating
        }))
      })
    );
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.updateProduct}${product.id}`, product);
  }
}
