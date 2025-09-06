import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css',
  imports: [CommonModule],
})
export class SpinnerComponent {
  constructor(public loadingService: LoadingService) {}
}
