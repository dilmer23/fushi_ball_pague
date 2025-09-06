import { Component } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../shared/services/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class AuthComponent {
  activeTab: 'login' | 'register' = 'login';
  loginForm: FormGroup;
  registerForm: FormGroup;
  errorMessage = '';
  
  // Nuevas propiedades para controlar la visibilidad de contraseñas
  showLoginPassword = false;
  showRegisterPassword = false;

  constructor(
    private productService: ProductService,
    private loading: LoadingService,
    private router: Router,
    private fb: FormBuilder) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Métodos para alternar visibilidad de contraseñas
  toggleLoginPasswordVisibility(): void {
    this.showLoginPassword = !this.showLoginPassword;
  }

  toggleRegisterPasswordVisibility(): void {
    this.showRegisterPassword = !this.showRegisterPassword;
  }

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.errorMessage = '';
  }

  async login() {
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    this.loading.show();
    try {
      const user = await this.productService.login(email, password);
      localStorage.setItem('supabase_session', JSON.stringify(user));
      const role = await this.productService.getUserRole(user.id);
      localStorage.setItem('user_role', role || 'comprador');
      this.router.navigate(['/']);
      console.log('Login exitoso', user);
    } catch (err: any) {
      this.errorMessage = err.message;
      this.loading.hide();
    } finally {
      this.loading.hide();
    }
  }

  async register() {
    if (this.registerForm.invalid) return;
    const { name, phone, age, email, password } = this.registerForm.value;
    this.loading.show();
    try {
      const user = await this.productService.register({ name, phone, age, email, password });
      this.switchTab('login');
    } catch (err: any) {
      this.errorMessage = err.message;
      this.loading.hide();
    } finally {
      this.loading.hide();
    }
  }

  async logout() {
    try {
      await this.productService.logout();
      console.log('Sesión cerrada');
    } catch (err: any) {
      this.errorMessage = err.message;
    }
  }
}