import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  stateLogin: boolean = false;
  isAdmin: boolean = false;
  isWriter: boolean = false;
  user: String = '';
  imgProfile: String = '';
  private userId: string = '';

  constructor(private authService: AuthService,
    private firebaseService: FirebaseService,
    private router: Router) {

    this.isAdmin = false;
    this.authService.stateUser().subscribe(user => {
      if (user) {
        this.stateLogin = true;
        this.userId = user.uid;
        this.getDatosUser(user.uid);
      } else {
        this.user = 'Not logged in';
        this.stateLogin = false;
      }
    });
  }

  ngOnInit(): void {
  }

  getDatosUser(uid: string) {
    const path = 'users';
    const id = uid;
    this.firebaseService.getDocumentById<User>(path, id).subscribe(data => {
      if (data) {
        this.user = ((data.userName) ? data.userName : data.email);
        this.imgProfile = ((data.photoURL) ? data.photoURL : '');
        const role = data.role;
        role.forEach(element => {
          if (element === 'admin') {
            this.isAdmin = true;
          }
          if (element === 'write') {
            this.isWriter = true;
          }
        });
      }
    });
  }

  goToProfile() {
    if (this.stateLogin) {
      this.router.navigate(['user/profile/settings/' + this.userId]);
    }
  }

  goToAdmin() {
    if (this.isAdmin || this.isWriter) {
      this.router.navigate(['/panel/admin']);
    }
  }

  signIn() {
    this.router.navigate(['/session/sing-in']);
  }

  signUp() {
    this.router.navigate(['/session/sing-up']);
  }

  signOut() {
    localStorage.removeItem('token');
    this.authService.signOut();
    window.location.reload();
  }
}
