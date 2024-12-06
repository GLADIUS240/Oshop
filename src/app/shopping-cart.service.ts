import { Injectable } from '@angular/core';
import { Database, ref, get, set, update, child, push } from '@angular/fire/database';
import { inject } from '@angular/core';
import { Product } from './models/product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  db: Database = inject(Database);

  private cartSubject = new BehaviorSubject<any>(null); 
  cart$ = this.cartSubject.asObservable(); 

  constructor() {
    this.loadCart();
  }

  private async loadCart() {
    const cartId = await this.getOrCreateCartId();
    const cartRef = ref(this.db, `/shopping-carts/${cartId}`);
    
    const snapshot = await get(cartRef);
    this.cartSubject.next(snapshot.val());
  }

  async getCart() {
    const cartId = await this.getOrCreateCartId();
    return ref(this.db, `/shopping-carts/${cartId}`);
  }

  async getOrCreateCartId(): Promise<string> {
    let cartId = this.getLocalStorageItem('cartId');
    if (!cartId) {
      const result = await this.create();
      this.setLocalStorageItem('cartId', result.key!);
      return result.key!;
    }
    return cartId;
  }

  private create() {
    const categoriesRef = ref(this.db, '/shopping-carts');
    return push(categoriesRef, { dateCreated: new Date().getTime() });
  }

  async addToCart(product: Product): Promise<void> {
    const cartId = await this.getOrCreateCartId();
    const sanitizedKey = product.$key;
    const itemRef = ref(this.db, `/shopping-carts/${cartId}/items/${sanitizedKey}`);
    
    const itemSnapshot = await get(itemRef); 
    const itemData = itemSnapshot.val();
    
    if (itemData) {
      const newQuantity = (itemData.quantity || 0) + 1;
      await update(itemRef, { quantity: newQuantity });

      this.cartSubject.next({
        ...this.cartSubject.value,
        items: {
          ...this.cartSubject.value.items,
          [sanitizedKey]: { ...itemData, quantity: newQuantity }
        }
      });
    } else {
      await set(itemRef, {
        product: {
          category: product.category,
          imageUrl: product.imageUrl,
          price: product.price,
          title: product.title,
        },
        quantity: 1
      });

      this.cartSubject.next({
        ...this.cartSubject.value,
        items: {
          ...this.cartSubject.value.items,
          [sanitizedKey]: {
            product,
            quantity: 1
          }
        }
      });
    }
  }

  private getLocalStorageItem(key: string): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setLocalStorageItem(key: string, value: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  }
}
