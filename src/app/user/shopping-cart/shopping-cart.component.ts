import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/services/alerts.service';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  productList: any = [];
  amountProductCart: number = 0;
  totalPrice: number = 0;
  user: string = '';

  constructor(private firebaseService: FirebaseService,
    private authService: AuthService,
    private router: Router,
    private alerts: AlertsService) { }

  ngOnInit(): void {
    this.authService.stateUser().subscribe(user => {
      if (!user) {
        this.alerts.messageWithImage('Error', 'You must be logged in to view the cart', '../../assets/images/undraw_login_re_4vu2.svg', false, 10000);
      } else {
        this.getCartList(user.uid);
        this.user = user.uid;
      }
    });
  }

  getCartList(uid: string) {
    this.firebaseService.getCollection('carts').subscribe(carts => {
      this.productList = carts.filter((cart: any) => cart.uid === uid && cart.status !== 'p');
      this.amountProductCart = this.productList.length;
      this.totalPrice = this.productList.reduce((total: number, product: any) => total + product.total, 0);
    });
  }

  minus(index: number) {
    if (this.productList[index].quantity > 1) {
      this.productList[index].quantity--;
      this.productList[index].total = this.productList[index].quantity * this.productList[index].product.price;
      this.updateCart(index);
    }
  }

  plus(index: number) {
    if (this.productList[index].quantity < this.productList[index].product.stock) {
      this.productList[index].quantity++;
      this.productList[index].total = this.productList[index].quantity * this.productList[index].product.price;
      this.updateCart(index);
    }
  }

  updateCart(index: number) {
    const resp = this.firebaseService.updateDocument(this.productList[index], 'carts', (this.user + '@' + this.productList[index].id));
    if (resp) {
      const message = 'Product updated';
      console.log(message);
    }
  }

  viewProduct(id: string) {
    this.router.navigate(['/view/info/product/', id]);
  }

  removeProduct(id: string) {
    this.firebaseService.deleteDocument('carts', (this.user + '@' + id)).then(() => {
      this.alerts.messageWithImage('Success', 'Product removed from cart', '../../assets/images/undraw_shopping_app_flsj.svg', true, 10000);
    }).catch(error => {
      this.alerts.messageWithImage('Error', error.message, '../../assets/images/undraw_cancel_u1it.svg', false, 10000);
    });
  }

  clearCart() {
    for (let i = 0; i < this.productList.length; i++) {
      this.removeProduct(this.productList[i].id);
    }
  }

  paymentOption() {
    this.router.navigate(['/checkout/payment/payment-options']);
  }

  back() {
    this.router.navigate(['/']);
  }

}
