import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common'; // Import isPlatformBrowser

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    return this.auth.user$.pipe(map(user => {
      if (user) return true;

      // Ensure navigation occurs only in the browser environment (not during SSR)
      if (isPlatformBrowser(this.platformId)) {
        this.router.navigate(['/login'],{queryParams:{returnUrl: state.url}});
      }
      return false;
    }));
  }
}
