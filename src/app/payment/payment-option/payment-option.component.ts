import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-payment-option',
  templateUrl: './payment-option.component.html',
  styleUrls: ['./payment-option.component.css']
})
export class PaymentOptionComponent implements OnInit {
  productList: any = [];
  amountProductCart: number = 0;
  subtotal: number = 0;
  shipping: number = 13500;
  coupon: number = 0;
  codeCoupon: string = 'PARCIAL2PJIC';
  private flag: boolean = false;
  user: string = '';
  total: number = 0;
  // private products: any;
  // products: any ;
  constructor(private firebaseService: FirebaseService,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.authService.stateUser().subscribe(user => {
      if (!user) {
      } else {
        this.getCartList(user.uid);
        this.user = user.uid;
      }
    });
  }

  getCartList(uid: string) {
    this.firebaseService.getCollection('carts').subscribe(carts => {
      this.productList = carts.filter((cart: any) => cart.uid === uid);
      this.amountProductCart = this.productList.length;
      this.subtotal = this.productList.reduce((total: number, product: any) => total + product.total, 0);
      this.coupon = this.randomIntFromInterval(0, (this.subtotal / 2 * 0.1));
      this.total = this.subtotal + this.shipping - this.coupon;
      if (this.productList.length === 0 && this.flag === false) {
        this.router.navigate(['/']);
      } else {
        this.flag = true;
      }
    });
  }

  randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  submit() {
    this.invoice();
  }

  invoice() {
    let idInvoice = this.randomIntFromInterval(1000000000, 9999999999);
    this.purchased(idInvoice.toString());
    this.router.navigate(['/checkout/invoice/' + idInvoice]);
  }

  purchased(idInvoice: string) {
    this.productList.forEach((product: any) => {
      const prod = product;
      this.productService.getProduct(prod.id).subscribe((product: any) => {
        let productTemp: Product = product as Product;
        productTemp.stock = productTemp.stock - prod.quantity;
        console.log(productTemp);
        this.updateProduct(productTemp, prod); // update stock product in firebase failed
        this.addPurchase(prod, idInvoice);
      });
    });
  }

  updateProduct(product: Product, prod: any) {
    // this.productService.updateProduct(product.id, product).then(() => {
    // }).catch(error => {
    // });
    this.firebaseService.updateDocument(product, 'products', product.id).then(() => {
    }).catch(error => {
    });
  }

  async addPurchase(prod: Product, idInvoice: string) {
    const resp = this.firebaseService.createDocument(prod, 'purchases', idInvoice);
    if (resp) {
      const resp = await this.firebaseService.createDocument(prod, 'cart-temp', (this.user + '@' + prod.id));
      this.removeProduct(prod.id);
    }
  }

  removeProduct(id: string) {
    this.firebaseService.deleteDocument('carts', (this.user + '@' + id)).then(() => {
    }).catch(error => {
    });
  }

}

