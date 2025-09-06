import { Component } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { AuthService } from '../../../shared/services/auth.service';
import { FavoriteService } from '../../../shared/services/favorite.service';
import { Product } from '../../../shared/models/product.interface';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { HeroSectionComponent } from '../../../shared/components/hero-section/hero-section.component';
import { CategoryListComponent } from '../../../shared/components/category-list/category-list.component';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, ProductCardComponent, HeroSectionComponent, CategoryListComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private spinner: LoadingService,
    private auth: AuthService,
    private favorite: FavoriteService
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      this.products = await this.productService.getProducts({
        isPopular: true,
        limit: 8
      });
      this.spinner.hide();
      const userId = this.auth.getCurrentUserId();
      if (userId) {
        const initial = (await this.productService.getUserFavorites(userId)).length;
        this.favorite.setCount(initial);
      }
    } catch {
      console.log("error al obtener productos")
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }
}
