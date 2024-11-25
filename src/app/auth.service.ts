import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, authState, User } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { UserService } from './user.service';
import { AppUser } from './models/app-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth: Auth = inject(Auth);
  router: Router = inject(Router);
  userService: UserService = inject(UserService); // Inject UserService here

  // Expose the user$ observable directly
  user$: Observable<User | null>;

  constructor(private route: ActivatedRoute) {
    this.user$ = authState(this.auth);
  }

  // Login method using Google
  login() {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);
    const provider = new GoogleAuthProvider();

    signInWithPopup(this.auth, provider)
      .then((result) => {
        const user = result.user;
        this.userService.save(user);  // Call save method here
        const returnUrl = localStorage.getItem('returnUrl') || '/';
        this.router.navigateByUrl(returnUrl);
        localStorage.removeItem('returnUrl');
        console.log('User signed in:', user);
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  }

  // Sign out method
  signout() {
    firebaseSignOut(this.auth)
      .then(() => {
        console.log('User signed out.');
      })
      .catch((error) => {
        console.error('Sign-out failed:', error);
      });
  }


  get appUser$():Observable<AppUser | null>{
    return this.user$.pipe(
      switchMap(user => {
        return this.userService.get(user!.uid); // Fetch user data if logged in
      }))
  }
}
