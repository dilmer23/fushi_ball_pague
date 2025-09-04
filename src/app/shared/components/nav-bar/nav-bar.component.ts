import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  menuActive = false;
  isLoggedIn = false;

   constructor(private productService: ProductService) {
    this.checkLogin();
  }
  async checkLogin() {
    const user = await this.productService.getCurrentUser();
    this.isLoggedIn = !!user;
  }

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }

  async logout() {
    try {
      await this.productService.logout();
      this.isLoggedIn = false;
      console.log('Sesión cerrada');
    } catch (err: any) {
      console.error(err.message);
    }
  }

}

