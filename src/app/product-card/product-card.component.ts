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
    // Subscribe to cart updates
    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      this.shoppingCart = cart; // Update shoppingCart when cart data changes
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
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
