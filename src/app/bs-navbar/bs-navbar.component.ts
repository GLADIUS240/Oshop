import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { CommonModule, NgIf, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../auth.service';
import { User } from '@angular/fire/auth';  
import { AppUser } from '../models/app-user';
import { ShoppingCartService } from '../shopping-cart.service';
import { get } from '@angular/fire/database';

@Component({
  selector: 'bs-navbar',
  standalone: true,
  imports: [RouterLink, NgbModule, NgIf, CommonModule],
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css']
})
export class BsNavbarComponent implements OnInit {
  user$: Observable<User | null> | undefined; 
  appUser: AppUser | null = null;
  private cartSubscription: Subscription = Subscription.EMPTY;
  cartItemCount: number = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
  private shoppingCartService:ShoppingCartService) {
    
  }

  ngOnInit(): void {
    this.authService.appUser$.subscribe(appUser => {
      this.appUser = appUser;
    });

    this.shoppingCartService.getCart().then(cartRef => {
      get(cartRef).then(snapshot => {
        const cart = snapshot.val(); 

        if (cart && cart.items) {
          this.cartItemCount = Object.values(cart.items).reduce((sum: number, item: any) => {
            return sum + item.quantity; 
          }, 0);
        } else {
          this.cartItemCount = 0; 
        }
      });
    });

    this.cartSubscription = this.shoppingCartService.cart$.subscribe(cart => {
      if (cart && cart.items) {
        this.cartItemCount = Object.values(cart.items).reduce((sum: number, item: any) => {
          return sum + item.quantity;
        }, 0);
      }
    });

  }


  logout() {
    if (isPlatformBrowser(this.platformId)) {
      this.authService.signout(); 
    }
  }
}
