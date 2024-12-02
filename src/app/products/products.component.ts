import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule,NgFor],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  products$: any;
  constructor(private productService:ProductService){
    this.products$= productService.getProducts();
  }
}
