import { Injectable } from '@angular/core';
import { Database, get, ref } from '@angular/fire/database';
import { inject } from '@angular/core';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  db: Database = inject(Database);
  constructor() { }

  // Method to fetch categories from the database
  getCategories(): Observable<any[]> {
    const categoriesRef = ref(this.db, '/categories');
    
    return from(get(categoriesRef).then(snapshot => {
      if (snapshot.exists()) {
        // Convert the Firebase object to an array and add the category key
        const categories = snapshot.val();
        return Object.keys(categories).map(key => ({
          $key: key,
          ...categories[key]
        }));
      } else {
        return [];
      }
    }));
  }
}
