import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { CommonModule, NgIf } from '@angular/common';
import { ShoppingCartService } from '../shopping-cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [NgIf, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input('product') product!: Product;
  @Input('show-actions') showActions = true;
  @Input('shopping-cart') shoppingCart: any;

  private cartSubscription: Subscription = Subscription.EMPTY;

  constructor(private cartService: ShoppingCartService) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      this.shoppingCart = cart;
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  addToCart() {
    this.cartService.addToCart(this.product);
  }
  removeFromCart(){
    this.cartService.removeFromCart(this.product);
  }

  getQuantity(): number {
    if (!this.shoppingCart || !this.shoppingCart.items) {
      return 0;
    }
    const productKey = this.product?.$key;
    if (!productKey) {
      return 0;
    }

    const item = this.shoppingCart.items[productKey];
    return item ? item.quantity : 0;
  }
}
