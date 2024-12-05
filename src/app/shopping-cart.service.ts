import { inject, Injectable } from '@angular/core';
import { Database, get, push, ref, set, update } from '@angular/fire/database';
import { Product } from './models/product';

function sanitizeKey(key: string): string {
  return key.replace(/[.#$/[\]]/g, '_'); 
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  db: Database = inject(Database);

  constructor() { }

  private create() {
    const categoriesRef = ref(this.db, '/shopping-carts');
    return push(categoriesRef, { dateCreated: new Date().getTime() });
  }


  private getCart(cartId: string) {
    return ref(this.db, `/shopping-carts/${cartId}`);
  }

  private async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
      const result = await this.create();
      localStorage.setItem('cartId', result.key!);
      return result.key!;
    }
    return cartId;
  }


  async addToCart(product: Product): Promise<void> {
    const cartId = await this.getOrCreateCartId();

    const sanitizedKey = sanitizeKey(product.$key);
    const itemRef = ref(this.db, `/shopping-carts/${cartId}/items/${sanitizedKey}`);
    const itemSnapshot = await get(itemRef);
    const itemData = itemSnapshot.val();

    if (itemData) {
      update(itemRef, { quantity: (itemData.quantity || 0) + 1 });
    } else {
      set(itemRef, { 
        product: {
          category:product.category,
          imageUrl: product.imageUrl,
          price: product.price,
          title: product.title,
        },
        quantity: 1
      });
    }
  }
}
