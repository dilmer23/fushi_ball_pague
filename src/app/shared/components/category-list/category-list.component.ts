import { Component } from '@angular/core';
import { CategoryCardComponent } from '../category-card/category-card.component';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category.interface';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule, CategoryCardComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {
  categories: Category[] = [
    {
      id: 1,
      name: 'La Liga',
      subtitle: 'Real Madrid, Barcelona, Atlético...',
      imageUrl: 'https://i.postimg.cc/C1LVWybt/camiseta-america-de-cali.jpg',
      teamCount: 12
    },
    {
      id: 2,
      name: 'Premier League',
      subtitle: 'Manchester, Liverpool, Chelsea...',
      imageUrl: 'https://i.postimg.cc/C1LVWybt/camiseta-america-de-cali.jpg',
      teamCount: 15
    },
    {
      id: 3,
      name: 'Serie A',
      subtitle: 'Juventus, Milan, Inter...',
      imageUrl: 'https://i.postimg.cc/C1LVWybt/camiseta-america-de-cali.jpg',
      teamCount: 10
    },
    {
      id: 4,
      name: 'Bundesliga',
      subtitle: 'Bayern Munchen, BVB, RB...',
      imageUrl: 'https://i.postimg.cc/C1LVWybt/camiseta-america-de-cali.jpg',
      teamCount: 8
    },
    {
      id: 5,
      name: 'Selecciones',
      subtitle: 'Selecciones Nacionales de todo el mundo',
      imageUrl: 'https://i.postimg.cc/C1LVWybt/camiseta-america-de-cali.jpg',
      teamCount: 20
    },
    {
      id: 6,
      name: 'Champions League',
      subtitle: 'Camisetas de la UEFA Champions League',
      imageUrl: 'https://i.postimg.cc/C1LVWybt/camiseta-america-de-cali.jpg',
      teamCount: 18
    },
  ];
}
