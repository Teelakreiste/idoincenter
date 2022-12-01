import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Cart } from '../models/product.model';
import { AlertsService } from '../services/alerts.service';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-info-product',
  templateUrl: './info-product.component.html',
  styleUrls: ['./info-product.component.css']
})

export class InfoProductComponent implements OnInit {

  quantityForm: FormGroup;
  products: any;
  private cartUser: Cart = {
    product: null,
    quantity: 0,
    total: 0,
    id: '',
    uid: ''
  };
  index: number = 0;

  constructor(private productService: ProductService,
    private firebaseService: FirebaseService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alerts: AlertsService) {
    this.quantityForm = this.createFormGroup();
  }

  ngOnInit(): void {
    this.productService.getProduct(this.getId()).subscribe(product => {
      this.products = product;
    });
  }

  createFormGroup() {
    return this.formBuilder.group({
      quantity: new FormControl(1, [Validators.required])
    });
  }

  getId() {
    return this.activatedRoute.snapshot.paramMap.get('id');
  }

  submit() {
    this.index = 0;
    if (this.quantityForm.valid) {
      this.addCart();
    }
  }

  async addCart() {
    const path = 'carts';
    this.setCart();
    this.authService.stateUser().subscribe(user => {
      if (user) {
        this.cartUser.uid = user.uid;
        this.cartUser.id = this.getId();
        this.checkExist(user);
      } else {
        this.alerts.messageWithImage('Error', 'You must be logged in to add to cart', '../../assets/images/undraw_login_re_4vu2.svg', false, 10000);
      }
    });
  }

  checkExist(user: any) {
    const path = 'carts';
    const data = this.firebaseService.getDocumentById<Cart>(path, (user.uid + '@' + this.cartUser.id));
    if (data) {
      data.subscribe(cart => {
        if (cart) {
          this.cartUser.quantity = cart.quantity + this.cartUser.quantity;
          this.cartUser.total = this.cartUser.product.price * this.cartUser.quantity;
          if (this.index == 0) {
            if (this.cartUser.quantity <= this.products.stock) {
              this.updateCart(user);
            } else {
              this.alerts.messageWithImage('Error', 'The quantity exceeds the stock', '../../assets/images/undraw_warning_re_eoyh.svg', false, 10000);
            }
            this.index++;
          }
        } else {
          if (this.index == 0) {
            if (this.cartUser.quantity <= this.products.stock) {
              this.createCart(user);
            } else {
              this.alerts.messageWithImage('Error', 'The quantity exceeds the stock', '../../assets/images/undraw_warning_re_eoyh.svg', false, 10000);
            }
            this.index++;
          }
        }
      });
    }
  }

  createCart(user: any) {
    const path = 'carts';
    this.firebaseService.createDocument(this.cartUser, path, (user.uid + '@' + this.cartUser.id));
    this.alerts.messageWithImage('Success', 'Product added to cart', '../../assets/images/undraw_shopping_app_flsj.svg', true, 10000);
  }

  updateCart(user: any) {
    const path = 'carts';
    this.firebaseService.updateDocument(this.cartUser, path, (user.uid + '@' + this.cartUser.id));
    this.alerts.messageWithImage('Success', 'Product added to cart', '../../assets/images/undraw_shopping_app_flsj.svg', true, 10000);
  }

  setCart() {
    this.cartUser.quantity = this.quantity.value;
    if (this.cartUser.quantity <= this.products.stock) {
      this.cartUser.product = this.products;
      this.cartUser.total = this.cartUser.product.price * this.cartUser.quantity;
    } else {
      this.alerts.messageWithImage('Error', 'The quantity exceeds the stock', '../../assets/images/undraw_warning_re_eoyh.svg', false, 10000);
    }
  }

  back() {
    window.history.back();
  }

  get quantity() { return this.quantityForm.get('quantity'); }

}
