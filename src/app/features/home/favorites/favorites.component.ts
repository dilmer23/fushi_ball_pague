import { Component, OnInit } from '@angular/core';
import { Product } from '../../../shared/models/product.interface';
import { AuthService } from '../../../shared/services/auth.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { Router } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorites',
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  products: Product[] = [];
  userId: string | null = null;

  constructor(
    private auth: AuthService,
    private loading: LoadingService,
    private router: Router,
    private productService: ProductService,
  ) { }

  async ngOnInit() {
    this.userId = this.auth.getCurrentUserId();
    if (!this.userId) {
      this.router.navigate(['/auth']);
      return;
    }

    this.loading.show();
    this.products = await this.productService.getUserFavoriteProducts(this.userId);
    this.loading.hide();
  }

  async onRemovedFromFavorites(productId: number) {
    this.userId = this.auth.getCurrentUserId();
    if (!this.userId) {
      this.router.navigate(['/auth']);
      return;
    }
    this.products = this.products.filter(p => p.id !== productId);
    this.products = await this.productService.getUserFavoriteProducts(this.userId);
  }
}
