import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';
import { Comment } from '../../models/comment.interface';
import { CommentsComponent } from '../comments-component/comments-component.component';
import { LoadingService } from '../../services/loading.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

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
  selectedSize: string | null = null;
  showDeleteConfirmation: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private loadingService: LoadingService,
    private auth: AuthService,
  ) { }

  get isAdmin() { return this.auth.isAdmin(); }

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadingService.show();
      this.product = await this.productService.getProductById(id);
      this.productComments = await this.productService.getCommentsByProduct(id);
      this.loadingService.hide();
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

    return `Hola, estoy interesado en el siguiente producto:*${this.product.name}*
Precio: ${this.product.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}${this.product.description}¿Podrían darme más información?`;
  }

  selectSize(size: string) {
    this.selectedSize = size;
  }

  async deleteProduct() {
    if (!this.product) return;

    const ok = await this.productService.softDeleteProduct(this.product.id);
    if (ok) {
      this.showDeleteConfirmation = false;
      Swal.fire({
        icon: 'success',
        title: 'Se eliminó su producto correctamente',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        position: 'top-end'
      });
      this.router.navigate(['/']);
    }
  }

  editProduct(): void {
    if (this.product) {
      // Navegar a la página de edición con el ID del producto
      this.router.navigate(['/edit-product', this.product.id]);
    }
  }

  confirmDelete(): void {
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
  }
}
