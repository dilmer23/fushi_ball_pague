import { Component } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // <- corregido
})
export class AuthComponent {
  activeTab: 'login' | 'register' = 'login';
  loginForm: FormGroup;
  registerForm: FormGroup;
  errorMessage = '';

  constructor(private productService: ProductService, private fb: FormBuilder) {
    // Inicializar loginForm
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Inicializar registerForm
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.errorMessage = '';
  }

  async login() {
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    try {
      const user = await this.productService.login(email, password);
      console.log('Login exitoso', user);
    } catch (err: any) {
      this.errorMessage = err.message;
    }
  }

  async register() {
    if (this.registerForm.invalid) return;
    const { name, phone, age, email, password } = this.registerForm.value;
    try {
      const user = await this.productService.register({ name, phone, age, email, password });
      console.log('Registro exitoso', user);
      this.switchTab('login'); // opcional: ir al login tras registrarse
    } catch (err: any) {
      this.errorMessage = err.message;
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
