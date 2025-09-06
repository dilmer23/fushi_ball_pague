import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { Product } from '../../../shared/models/product.interface';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { LoadingService } from '../../../shared/services/loading.service';
import { FavoriteService } from '../../../shared/services/favorite.service';
import { AuthService } from '../../../shared/services/auth.service';
import { FormsModule } from '@angular/forms';
import { ProductFilter } from '../../../shared/models/filter.interface';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  // Filtros
  filters: ProductFilter = {};
  searchTerm: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  minRating: number | null = null;
  showPopularOnly: boolean = false;
  sortBy: string = 'created_at';
  sortOrder: 'asc' | 'desc' = 'desc';
  showFilters: boolean = true;


  // Opciones de ordenamiento
  sortOptions = [
    { value: 'created_at', label: 'Más recientes' },
    { value: 'price', label: 'Precio' },
    { value: 'rating', label: 'Rating' },
    { value: 'name', label: 'Nombre' }
  ];

  constructor(
    private productService: ProductService,
    private loading: LoadingService,
    private auth: AuthService,
    private favorite: FavoriteService
  ) { }

  async ngOnInit() {
    this.loading.show();
    await this.loadProducts();
    this.loading.hide();

    const userId = this.auth.getCurrentUserId();
    if (userId) {
      const initial = (await this.productService.getUserFavorites(userId)).length;
      this.favorite.setCount(initial);
    }
  }

  async loadProducts() {
    this.products = await this.productService.getProducts();
    this.applyFilters();
  }

  applyFilters() {
    this.updateFilterObject();

    this.filteredProducts = this.products.filter(product => {
      // Filtro por término de búsqueda
      if (this.searchTerm &&
        !product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        !product.description.toLowerCase().includes(this.searchTerm.toLowerCase())) {
        return false;
      }

      // Filtro por precio mínimo
      if (this.minPrice !== null && product.price < this.minPrice) {
        return false;
      }

      // Filtro por precio máximo
      if (this.maxPrice !== null && product.price > this.maxPrice) {
        return false;
      }

      // Filtro por rating mínimo
      if (this.minRating !== null && product.rating < this.minRating) {
        return false;
      }

      // Filtro por productos populares
      if (this.showPopularOnly && !product.is_popular) {
        return false;
      }

      return true;
    });

    // Ordenar resultados
    this.sortProducts();
  }

  updateFilterObject() {
    this.filters = {};

    if (this.searchTerm) this.filters.searchTerm = this.searchTerm;
    if (this.minPrice !== null) this.filters.minPrice = this.minPrice;
    if (this.maxPrice !== null) this.filters.maxPrice = this.maxPrice;
    if (this.minRating !== null) this.filters.minRating = this.minRating;
    if (this.showPopularOnly) this.filters.isPopular = true;

    this.filters.sortBy = this.sortBy as any;
    this.filters.sortOrder = this.sortOrder;
  }

  sortProducts() {
    this.filteredProducts.sort((a, b) => {
      let valueA: any, valueB: any;

      switch (this.sortBy) {
        case 'price':
          valueA = a.price;
          valueB = b.price;
          break;
        case 'rating':
          valueA = a.rating;
          valueB = b.rating;
          break;
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        default: // created_at
          // Asumiendo que tienes una propiedad createdDate
          valueA = a.created_at || 0;
          valueB = b.created_at || 0;
          break;
      }

      if (this.sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }

  onFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.searchTerm = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.minRating = null;
    this.showPopularOnly = false;
    this.sortBy = 'created_at';
    this.sortOrder = 'desc';
    this.applyFilters();
  }

  get filteredProductsCount(): number {
    return this.filteredProducts.length;
  }

  get totalProductsCount(): number {
    return this.products.length;
  }
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
}