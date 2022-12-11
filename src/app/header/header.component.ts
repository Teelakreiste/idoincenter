import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyI } from '../models/company.model';
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
  title: String = 'Management';
  qtyCart: number = 0;

  companyInfo: CompanyI = {
    uid: null,
    name: null,
    description: null,
    logo: null,
    email: null,
    address: null,
    country: null,
    city: null,
    state: null,
    zip: null,
    phone: null,
    fax: null,
    website: null,
    facebook: null,
    twitter: null,
    instagram: null
  }

  constructor(private authService: AuthService,
    private firebaseService: FirebaseService,
    private router: Router) {

    this.isAdmin = false;
    this.authService.stateUser().subscribe(user => {
      if (user) {
        this.stateLogin = true;
        this.userId = user.uid;
        this.getDatosUser(user.uid);
        this.getCartList(user.uid);
      } else {
        this.user = 'Not logged in';
        this.stateLogin = false;
      }
    });
  }

  ngOnInit(): void {
    this.getCompanyInfo();
  }

  getCompanyInfo() {
    const path = 'companyInfo';
    const uid = 'iuO7xPy64jtjCBBFfeM1'
    this.firebaseService.getDocumentById<CompanyI>(path, uid).subscribe(data => {
      if (data) {
        this.companyInfo = data;
      } else {
        const resp = this.firebaseService.createDocument(this.companyInfo, path, uid);
        if (resp) {
          console.log('Company info created');
        }
      }
    });
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
            this.title = 'Administration'
          }
          if (element === 'write') {
            this.isWriter = true;
          }
        });
      }
    });
  }

  getCartList(uid: string) {
    this.firebaseService.getCollection('carts').subscribe(carts => {
      this.qtyCart = carts.filter((cart: any) => cart.uid === uid).length;
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

  goToCompanyInfo() {
    if (this.isAdmin) {
      this.router.navigate(['/panel/admin/company/info']);
    }
  }

  goToCart() {
    if (this.stateLogin) {
      this.router.navigate(['/user/shopping-cart']);
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
