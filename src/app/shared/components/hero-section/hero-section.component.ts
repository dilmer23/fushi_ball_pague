import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CarouselImage } from '../../models/carousel.interface';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css']
})
export class HeroSectionComponent implements OnInit {
  images: CarouselImage[] = [];

  constructor(private productServices: ProductService) {}

  async ngOnInit() {
    this.images = await this.productServices.getActiveImages();
  }
}
