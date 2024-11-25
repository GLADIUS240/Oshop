import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { environment } from '../environments/environment.development';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';  // Import your routes configuration
import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';
import { UserService } from './user.service';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { AdminAuthGuardService } from './admin-auth-guard.service';

export const appConfig: ApplicationConfig = {
  
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    AuthService,AuthGuardService,UserService,AdminAuthGuardService,
    provideRouter(routes)  // Use the routes here
  ]
  
};
