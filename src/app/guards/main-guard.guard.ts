import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class MainGuardGuard implements CanActivate {
  private writeAccess: boolean = false;
  private readAccess: boolean = false;
  constructor(private router: Router,
    private authService: AuthService, private firebaseService: FirebaseService) {
  }

  userState() {
    this.authService.stateUser().subscribe(user => {
      if (user) {
        this.getDatosUser(user.uid);
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
    this.writeAccess = false;
    this.readAccess = false;
    for (let i = 0; i < role.length; i++) {
      if (role[i] === 'write') {
        this.writeAccess = true;
      }
      if (role[i] === 'read') {
        this.readAccess = true;
      }
    }
    if (!this.readAccess && this.writeAccess) {
      this.router.navigate(['/panel/admin/']);
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.userState();
    return true;
  }

}
