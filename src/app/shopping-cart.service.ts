import { Injectable } from '@angular/core';
import { Database, ref, get, set, update, child, push, remove } from '@angular/fire/database';
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

  private async updateCartItem(product: Product, quantityChange: number): Promise<void> {
    const cartId = await this.getOrCreateCartId();
    const sanitizedKey = product.$key;
    const itemRef = ref(this.db, `/shopping-carts/${cartId}/items/${sanitizedKey}`);
    
    const itemSnapshot = await get(itemRef); 
    const itemData = itemSnapshot.val();
    
    const newQuantity = (itemData?.quantity || 0) + quantityChange;
    
    if (newQuantity > 0) {
      await update(itemRef, { quantity: newQuantity });
      this.cartSubject.next({
        ...this.cartSubject.value,
        items: {
          ...this.cartSubject.value.items,
          [sanitizedKey]: { ...itemData, quantity: newQuantity }
        }
      });
    } else {
      await remove(itemRef); 
      const { [sanitizedKey]: removedItem, ...remainingItems } = this.cartSubject.value.items;
      this.cartSubject.next({
        ...this.cartSubject.value,
        items: remainingItems
      });
    }
  }
  
  async addToCart(product: Product): Promise<void> {
    await this.updateCartItem(product, 1);
  }
  
  async removeFromCart(product: Product): Promise<void> {
    await this.updateCartItem(product, -1); 
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
