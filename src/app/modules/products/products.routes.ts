import { Routes } from '@angular/router';
import { ProductsListComponent } from './products-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';


export const PRODUCTS_ROUTES: Routes = [
    {
        path: '',
        component: ProductsListComponent
    },
    {
        path: 'products/:category',
        component: ProductsListComponent
    },
    {
        path: 'product-detail/:id',
        component: ProductDetailsComponent
    }
];