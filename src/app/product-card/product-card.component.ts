import { Component, Input } from '@angular/core';
import { Product } from '../models/product';
import { CommonModule, NgIf } from '@angular/common';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [NgIf,CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input('product')
  product!: Product;
  @Input('show-actions')showActions=true;

constructor(private cartService:ShoppingCartService){

}

  addToCart(product:Product){
    this.cartService.addToCart(product);
  }

}
