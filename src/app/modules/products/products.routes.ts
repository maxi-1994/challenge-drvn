import { Routes } from '@angular/router';
import { ProductsListComponent } from './products-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';


export const PRODUCTS_ROUTES: Routes = [
    {
        path: '',
        component: ProductsListComponent
    },
    {
        path: 'product/:id',
        component: ProductDetailsComponent
    }
];