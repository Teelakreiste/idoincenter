import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardGuard implements CanActivate {
  private adminAccess: boolean = false;
  private writeAccess: boolean = false;
  constructor(private router: Router,
    private authService: AuthService, private firebaseService: FirebaseService) {
  }

  userState() {
    this.authService.stateUser().subscribe(user => {
      if (user) {
        this.getDatosUser(user.uid);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  getDatosUser(uid: string) {
    const path = 'users';
    const id = uid;
    this.firebaseService.getDocumentById<User>(path, id).subscribe(data => {
      if (data) {
        const role = data.role;
        this.verifyAdminRole(role);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  verifyAdminRole(role: string[]) {
    this.adminAccess = false;
    this.writeAccess = false;
    for (let i = 0; i < role.length; i++) {
      if (role[i] === 'admin') {
        this.adminAccess = true;
        break;
      } else if (role[i] === 'write') {
        this.writeAccess = true;
      }
    }
    if (!this.adminAccess && !this.writeAccess) {
      this.router.navigate(['/']);
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.userState();
    return true;
  }

}
