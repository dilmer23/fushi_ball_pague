import { Routes } from '@angular/router';
import { ProductDetailComponent } from './shared/components/product-detail/product-detail.component';
import { ProductFormComponent } from './shared/components/product-form/product-form.component';
import { AuthComponent } from './features/auth/login/login.component';
import { ProductComponent } from './features/home/product/product.component';
import { VerifyComponent } from './features/auth/verify/verify.component';
import { FavoritesComponent } from './features/home/favorites/favorites.component';
import { LandingComponent } from './features/home/landing/landing.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'create-product', component: ProductFormComponent },
  { path: 'edit-product/:id', component: ProductFormComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'auth/confirm', component: VerifyComponent },
  { path: 'product', component: ProductComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: '**', redirectTo: '' }
];
