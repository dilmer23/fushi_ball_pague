import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import Swal from 'sweetalert2';

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

  constructor(private fb: FormBuilder, private productService: ProductService) {}

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

  async onSubmit() {
    if (this.form.valid) {
      try {
        const product = await this.productService.createProduct(this.form.value as any);

        if (product) {
          console.log('✅ Producto creado:', product);
          Swal.fire({
            icon: 'success',
            title: 'Producto creado',
            text: `El producto "${product.name}" se creó correctamente ✅`
          });

          // Limpia el formulario y la vista previa
          this.form.reset({
            name: '',
            description: '',
            price: 0,
            oldPrice: null,
            imageUrl: '',
            rating: 0,
            reviews: 0,
            tag: ''
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: '⚠️ No se pudo crear el producto. Intenta de nuevo.'
          });
        }
      } catch (error) {
        console.error('❌ Error en onSubmit:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error inesperado',
          text: '❌ Ocurrió un error al crear el producto.'
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
