import { inject, Injectable } from '@angular/core';
import { Database, push, ref } from '@angular/fire/database';

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
}
