import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedGuardGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  redirect(flag: boolean): any {
    if (!flag) {
      this.router.navigate(['/home']);
    }
  }

  async GetAuth() {
    return await this.auth.isLogged();
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = localStorage.getItem('token');
    if (user) {
      this.redirect(true);
    }
    else {
      this.redirect(false);
    }
    return true;
  }
}
