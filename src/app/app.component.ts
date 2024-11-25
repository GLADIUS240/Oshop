import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BsNavbarComponent } from './bs-navbar/bs-navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BsNavbarComponent,RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'oshop-g';
}
