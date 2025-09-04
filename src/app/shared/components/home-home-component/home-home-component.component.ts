import { Component, OnInit } from '@angular/core';
import { HeroSectionComponent } from '../hero-section/hero-section.component';
import { CategoryListComponent } from '../category-list/category-list.component';
import { ProductCardComponent } from '../product-card/product-card.component'; 
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-home-component',
  standalone: true,
  imports: [CommonModule ,HeroSectionComponent, CategoryListComponent, ProductCardComponent], 
  templateUrl: './home-home-component.component.html',
  styleUrls: ['./home-home-component.component.css']
})
export class HomeHomeComponentComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  async ngOnInit() {
    this.products = await this.productService.getProducts();
  }
}
