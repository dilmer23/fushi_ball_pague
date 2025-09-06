import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../models/product.interface';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { FavoriteService } from '../../services/favorite.service';


@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  @Input() isFavoritesView = false;
  @Output() removedFromFavorites = new EventEmitter<number>();
  userId: string | null = null;
  isFav = false;

  constructor(
    private productService: ProductService,
    private auth: AuthService,
    private router: Router,
    private favorite: FavoriteService
  ) { }

  get isSesion() { return this.auth.isSesion(); }
  get isAdmin() { return this.auth.isAdmin(); }

  get starsArray() {
    return Array(Math.floor(this.product.rating)).fill(0);
  }

  get buttonIcon(): string {
    return this.isFavoritesView ? 'fa-trash' : 'fa-heart';
  }

  get buttonTitle(): string {
    return this.isFavoritesView ? 'Eliminar favorito' : 'Agregar a favoritos';
  }

  async ngOnInit() {
    if (this.isSesion) {
      this.userId = this.auth.getCurrentUserId();
    }
  }

  async onFavoriteClick() {
    if (!this.isSesion) {
      this.router.navigate(['/auth']);
      return;
    }
    if (this.isFavoritesView) {
      await this.productService.removeFavorite(this.userId!, this.product.id);
      this.isFav = false;
      this.removedFromFavorites.emit(this.product.id);
    } else {
      await this.productService.toggleFavorite(this.userId!, this.product.id, this.isFav);
      this.isFav = !this.isFav;
    }
    Swal.fire({
      icon: 'success',
      title: this.isFav ? '¡Agregado a favoritos!' : '¡Eliminado de favoritos!',
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      position: 'top-end'
    });
  }
}
