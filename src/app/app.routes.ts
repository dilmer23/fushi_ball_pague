import { Routes } from '@angular/router';
import { ProductDetailComponent } from './shared/components/product-detail/product-detail.component';
import { ProductFormComponent } from './shared/components/product-form/product-form.component';
import { AppComponent } from './app.component';
import { HomeHomeComponentComponent } from './shared/components/home-home-component/home-home-component.component';
import { AuthComponent } from './features/auth/login/login.component';
import { VerifyComponent } from './features/auth/login/verify/verify.component';

export const routes: Routes = [
  { path: '', component: HomeHomeComponentComponent }, 
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'create-product', component: ProductFormComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'auth/verify', component: VerifyComponent },
  { path: '**', redirectTo: '' } 
];
