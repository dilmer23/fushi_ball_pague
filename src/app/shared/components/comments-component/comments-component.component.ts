import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Comment } from '../../models/comment.interface';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comments-component.component.html',
  styleUrls: ['./comments-component.component.css']
})
export class CommentsComponent {
  @Input() comments: Comment[] = [];
  @Input() productId!: number;

  commentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.commentForm = this.fb.group({
      user: ['Anonimo'],
      text: [''],
      rating: [5]
    });
  }

  async submitComment() {
    if (!this.productId) return;

    const { user, text, rating } = this.commentForm.value;
    if (!user || !text) return;

    const ok = await this.productService.addComment(
      this.productId,
      user,
      text,
      rating ?? 5
    );

    if (ok) {
      this.comments = await this.productService.getCommentsByProduct(this.productId);
      this.commentForm.reset({ rating: 5 });
    }
  }
  setRating(value: number) {
  this.commentForm.patchValue({ rating: value });
}

}
