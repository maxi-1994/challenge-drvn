import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ProductsListComponent } from '../../modules/products/products-list.component';
import { of } from 'rxjs';
import { CurrencyService } from '../../core/services/currency.service';
import { ProductsService } from '../../modules/products/services/products.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

class MockProductsService {
  getProducts = jasmine.createSpy().and.returnValue(of({ products: [], total: 0 }));
  searchProducts = jasmine.createSpy().and.returnValue(of({ products: [], total: 0 }));
};

class MockCurrencyService {
  private currencyValue = 'USD';
  currency = jasmine.createSpy().and.callFake(() => this.currencyValue);
  toggleCurrency = jasmine.createSpy().and.callFake(() => {
    this.currencyValue = this.currencyValue === 'USD' ? 'EUR' : 'USD';
  });
};

const mockActivatedRoute = {
    paramMap: of(convertToParamMap({ category: 'electronics' })),
    queryParams: of({})
  };

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsListComponent],
      providers: [
        { provide: ProductsService, useClass: MockProductsService },
        { provide: CurrencyService, useClass: MockCurrencyService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter products based on search input', () => {
    const productsService = TestBed.inject(ProductsService) as unknown as MockProductsService;
    const mockProducts = [{ id: 1, title: 'Mock Product', thumbnail: '', brand: '', price: 100, stock: 10, rating: 4 }];
    productsService.searchProducts.and.returnValue(of({ products: mockProducts, total: 1 }));

    component.onSearchChange('mock');
    fixture.detectChanges();

    expect(component.products()).toEqual(mockProducts);
    expect(productsService.searchProducts).toHaveBeenCalledWith('mock', 10, 0);
  });

  it('should toggle currency when switch is clicked', () => {
    const currencyService = TestBed.inject(CurrencyService) as unknown as MockCurrencyService;
  
    expect(currencyService.currency()).toBe('USD');
  
    component.onCurrencyToggle();
    expect(currencyService.toggleCurrency).toHaveBeenCalled();
    expect(currencyService.currency()).toBe('EUR');
  });

  it('should persist currency after navigation simulation', () => {
    const currencyService = TestBed.inject(CurrencyService) as unknown as MockCurrencyService;
  
    component.onCurrencyToggle(); 
    expect(currencyService.currency()).toBe('EUR');
  
    const newComponentInstance = TestBed.createComponent(ProductsListComponent).componentInstance;
    expect(newComponentInstance.currencyService.currency()).toBe('EUR');
  });
});
