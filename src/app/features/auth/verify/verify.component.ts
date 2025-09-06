import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../shared/services/product.service';

@Component({
  selector: 'app-verify',
  imports: [CommonModule],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent {
  message = 'Verificando correo...';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productSvc: ProductService
  ) { }

  async ngOnInit() {
    const token_hash = this.route.snapshot.queryParamMap.get('token_hash');
    const type = this.route.snapshot.queryParamMap.get('type') as 'signup' | 'recovery' | 'invite';

    if (!token_hash || !type) {
      this.message = 'Enlace inválido o expirado.';
      return;
    }

    try {
      await this.productSvc.verifyEmail(token_hash, type);
      this.message = '✅ Correo confirmado con éxito. Redirigiendo...';
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } catch (err: any) {
      this.message = '❌ Error al confirmar el correo: ' + err.message;
    }
  }
}
