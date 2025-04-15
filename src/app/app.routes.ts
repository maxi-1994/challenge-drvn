import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./modules/products/products.routes').then(m => m.PRODUCTS_ROUTES)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
