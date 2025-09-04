import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product!: Product;
  get starsArray() {
    return Array(Math.floor(this.product.rating)).fill(0);
  }
}
