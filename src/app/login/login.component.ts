import { Component, inject } from '@angular/core';
import { Auth, GoogleAuthProvider , signInWithPopup} from '@angular/fire/auth';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private auth:AuthService) {
  }
  // Google Login
  loginWithGoogle() {
    this.auth.login();
  }

  
}
