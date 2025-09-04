import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';
import { Comment } from '../../models/comment.interface';
import { CommentsComponent } from '../comments-component/comments-component.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, CommentsComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  productComments: Comment[] = [];
  private readonly WHATSAPP_NUMBER = '573025229721';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.product = await this.productService.getProductById(id);
      this.productComments = await this.productService.getCommentsByProduct(id);
      console.log('📌 Detalle producto:', this.product);
      console.log('💬 Comentarios:', this.productComments);
    }
  }

  async addCommentDemo() {
    if (!this.product) return;

    const success = await this.productService.addComment(
      this.product.id,
      'DemoUser',
      'Comentario agregado desde Supabase ✅',
      5
    );

    if (success) {
      this.productComments = await this.productService.getCommentsByProduct(this.product.id);
    }
  }

  sendWhatsAppMessage(): void {
    if (!this.product) return;

    // Formatear el mensaje con los detalles del producto
    const message = this.formatWhatsAppMessage();

    // Crear la URL de WhatsApp
    const whatsappUrl = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    // Abrir WhatsApp en una nueva ventana
    window.open(whatsappUrl, '_blank');
  }
  private formatWhatsAppMessage(): string {
    if (!this.product) return '';

    return `Hola, estoy interesado en el siguiente producto:
    
*${this.product.name}*
Precio: ${this.product.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
${this.product.description}

¿Podrían darme más información?`;
  }
}
