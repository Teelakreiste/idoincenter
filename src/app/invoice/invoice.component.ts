import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyI } from '../models/company.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  productList: any = [];
  lengthProductList: number = 0;
  amountProductCart: number = 0;
  subtotal: number = 0;
  user: string = '';
  total: number = 0;
  idInvoice: string = '';
  orderDate: Date = new Date();

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

  userInfo: User = {
    uid: null,
    firstName: null,
    lastName: null,
    userName: null,
    email: null,
    phoneNum: null,
    mobileNum: null,
    password: null,
    photoURL: null,
    birthday: null,
    role: null
  }


  constructor(private firebaseService: FirebaseService,
    private authService: AuthService,
    private router: Router) {
      this.idInvoice =  (this.randomIntFromInterval(0, 999999)).toString();
  }

  ngOnInit(): void {
    this.authService.stateUser().subscribe(user => {
      if (!user) {
      } else {
        this.getCompanyInfo();
        this.getDatosUser(user.uid);
        this.getCartList(user.uid);
        this.user = user.uid;
      }
    });
  }

  getDatosUser(uid: string) {
    const path = 'users';
    const id = uid;
    this.firebaseService.getDocumentById<User>(path, id).subscribe(data => {
      if (data) {
        this.userInfo = data;
      }
    });
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

  getCartList(uid: string) {
    this.firebaseService.getCollection('cart-temp').subscribe(carts => {
      this.productList = carts.filter((cart: any) => cart.uid === uid);
      this.amountProductCart = this.productList.length;
      this.subtotal = this.productList.reduce((total: number, product: any) => total + product.total, 0);
      this.lengthProductList = this.productList.length;
    });
  }

  randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  backToHome() {
    this.firebaseService.deleteCollection('cart-temp');
    this.router.navigate(['/home']);
  }
}
