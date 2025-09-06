import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  menuActive = false;
  isLoggedIn = false;
  favCount = 0; // siempre actualizado vía observable

  constructor(
    private productService: ProductService,
    private auth: AuthService,
    private router: Router,
    private favorite: FavoriteService
  ) {
    this.checkLogin();
  }

  get isAdmin() { return this.auth.isAdmin(); }
  get isSesion() { return this.auth.isSesion(); }

  async ngOnInit() {
    const userId = this.auth.getCurrentUserId();
    if (userId) {
      // contador inicial
      const initial = (await this.productService.getUserFavorites(userId)).length;
      this.favorite.setCount(initial);
    }

    // suscripción para cambios futuros
    this.favorite.favCountObs$.subscribe(count => this.favCount = count);
  }

  async checkLogin() {
    const user = await this.productService.getCurrentUser();
    this.isLoggedIn = !!user;
  }

  async logout() {
    await this.productService.logout();
    this.isLoggedIn = false;
    localStorage.clear();
    this.favorite.reset(); // emite 0
    this.router.navigate(['/']);
  }

  toggleMenu() { this.menuActive = !this.menuActive; }
}