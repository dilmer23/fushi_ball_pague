import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../shared/services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify',
  imports: [CommonModule],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent {

   constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productSvc: ProductService
  ) {}

  async ngOnInit() {
    try {
      const q = this.route.snapshot.queryParamMap;
      const tokenHash = q.get('token_hash');
      const type      = q.get('type') as any; 
      if (!tokenHash) { throw new Error('Falta token'); }
      await this.productSvc.verifyEmail(tokenHash, type || 'signup');
      await this.router.navigate(['/'], { replaceUrl: true });
    } catch (e: any) {
      console.error(e);
      await this.router.navigate(['/auth'], { 
        queryParams: { error: 'verify_failed' } 
      });
    }
  }
}
