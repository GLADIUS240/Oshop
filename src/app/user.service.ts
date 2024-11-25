import { Injectable } from '@angular/core';
import { Database, ref, get, update } from '@angular/fire/database';
import { inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import { AppUser } from './models/app-user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  db: Database = inject(Database);

  constructor() {}
  save(user: User) {
    const userRef = ref(this.db, 'users/' + user.uid);
    // Update user data in the database
    update(userRef, {
      name: user.displayName,
      email: user.email
    })
    .then(() => {
      console.log('User data updated successfully');
    })
    .catch((error) => {
      console.error('Error updating user data:', error);
    });
  }

  get(uid: string): Observable<AppUser | null> {
    const userRef = ref(this.db, 'users/' + uid);
    return new Observable((observer) => {
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            observer.next(snapshot.val() as AppUser); // Successfully retrieved the data
          } else {
            observer.error('No data available for this user');
          }
        })
        .catch((error) => {
          observer.error(error); // Handle errors while fetching data
        });
    });
  }
}
