import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Category } from '../../models/category.interface';


@Component({
  selector: 'app-category-card',
  imports: [CommonModule],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.css'
})
export class CategoryCardComponent {
   @Input() category!: Category;

}
