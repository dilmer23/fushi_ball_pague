import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  uploading = false;
  form!: FormGroup;
  isEditMode = false;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      oldPrice: [null],
      imageUrl: [''],
      rating: [0],
      reviews: [0],
      tag: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = Number(id);
      this.loadProductData(this.productId);
    }
  }

  async loadProductData(id: number) {
    try {
      const product = await this.productService.getProductById(id);
      if (product) {
        this.form.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          oldPrice: product.oldPrice || null,
          imageUrl: product.image_url,
          rating: product.rating || 0,
          reviews: product.reviews || 0,
          tag: product.tag || '',
          sizes: product.sizes || []
        });
      }
    } catch (error) {
      console.error('Error loading product data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar la información del producto'
      });
    }
  }
  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.uploading = true;
      const url = await this.productService.uploadImage(file);
      console.log('✅ URL de imagen subida:', url);
      if (url) {
        this.form.patchValue({ imageUrl: url });
        Swal.fire({
          icon: 'success',
          title: 'Imagen subida',
          text: 'La imagen se ha cargado correctamente ✅',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo subir la imagen ❌'
        });
      }
      this.uploading = false;
    }
  }
  // En product-form.component.ts, modifica el método onSubmit
  async onSubmit() {
    if (this.form.valid) {
      try {
        let result: Product | null; // Define explícitamente el tipo

        if (this.isEditMode && this.productId) {
          // Modo edición
          result = await this.productService.updateProduct(this.productId, this.form.value);

          if (result) {
            console.log('✅ Producto actualizado:', result);

            // Mostrar alerta de éxito y redirigir al home
            Swal.fire({
              icon: 'success',
              title: 'Producto actualizado',
              text: `El producto "${result.name}" se actualizó correctamente ✅`,
              showConfirmButton: true,
              confirmButtonText: 'Aceptar'
            }).then(() => {
              // Redirigir al home después de hacer clic en Aceptar
              this.router.navigate(['/']);
            });
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'Atención',
              text: '⚠️ No se pudo actualizar el producto. Intenta de nuevo.'
            });
          }
        } else {
          // Modo creación
          result = await this.productService.createProduct(this.form.value as Omit<Product, 'id'>);

          if (result) {
            console.log('✅ Producto creado:', result);

            Swal.fire({
              icon: 'success',
              title: 'Producto creado',
              text: `El producto "${result.name}" se creó correctamente ✅`,
              didClose: () => {
                this.router.navigate(['/product', result!.id]); // Usamos el operador ! para asegurar que no es null
              }
            });
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'Atención',
              text: '⚠️ No se pudo crear el producto. Intenta de nuevo.'
            });
          }
        }
      } catch (error) {
        console.error('❌ Error en onSubmit:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error inesperado',
          text: '❌ Ocurrió un error al guardar el producto.'
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: '⚠️ Completa todos los campos requeridos antes de guardar.'
      });
    }
  }
}
