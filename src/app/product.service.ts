import { inject, Injectable } from '@angular/core';
import { Database, get, push, ref, remove, update } from '@angular/fire/database';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  db: Database = inject(Database);
  constructor() { }
  create(product: any){
    const categoriesRef = ref(this.db, '/products');
    return push(categoriesRef,product);
  }

  getProducts(): Observable<any[]> {
    const productsRef = ref(this.db, '/products');
    
    return from(get(productsRef).then(snapshot => {
      if (snapshot.exists()) {
        const products = snapshot.val();
        return Object.keys(products).map(key => ({
          $key: key,
          ...products[key]
        }));
      } else {
        return [];
      }
    }));
  }
  
  get(productId: string) {
    const prodRef = ref(this.db, '/products/' + productId);
    return from(get(prodRef).then((snapshot) => snapshot.val()));
  }

  update(productId:string,product:any){
    const prodRef = ref(this.db, '/products/' + productId);
    return from(update(prodRef,product));
  }
  
  delete(productId:string){
    const prodRef = ref(this.db, '/products/' + productId);
    return from(remove(prodRef));
  }
}
