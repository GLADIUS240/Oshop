import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { CommonModule, NgIf, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../auth.service';
import { User } from '@angular/fire/auth';  // Import User from firebase/auth
import { AppUser } from '../models/app-user';

@Component({
  selector: 'bs-navbar',
  standalone: true,
  imports: [RouterLink, NgbModule, NgIf, CommonModule],
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css']
})
export class BsNavbarComponent implements OnInit {
  user$: Observable<User | null> | undefined;  // Directly use the user$ observable from AuthService
  appUser!: AppUser;
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private authService: AuthService) {
    authService.appUser$.subscribe(appUser=>this.appUser);
  }

  ngOnInit(): void {
    // No need to handle authState here; it's already handled by AuthService
  }

  // Logout method utilizing AuthService
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      this.authService.signout();  // Call the signout method from AuthService
    }
  }
}
