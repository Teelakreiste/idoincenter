import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { flush } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ImageService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';

import Swal from 'sweetalert2'

import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-show-products',
  templateUrl: './show-products.component.html',
  styleUrls: ['./show-products.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ShowProductsComponent implements OnInit {

  width: number;
  element: number;
  navigation: boolean;
  products: Product[];
  isAdmin: boolean = false;
  searchText: string = '';

  constructor(private router: Router,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private imageService: ImageService,
    private productService: ProductService) {
    this.isAdmin = false;
    this.user();
    this.calcElemntWidth();
  }

  ngOnInit(): void {
    this.getProducts();
  }

  user() {
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
        role.forEach(element => {
          if (element === 'admin') {
            this.isAdmin = true;
          }
        });
      }
    });
  }

  getProducts() {
    this.productService.getProducts().subscribe(product => {
      this.products = product.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Product
        }
      })
    });
  }

  searchProducts(searchText: string) {
    this.productService.searchProducts(searchText).subscribe(product => {
      this.products = product.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Product
        }
      })

      if (this.products.length === 0) {
        this.productService.searchProductsCategory(searchText).subscribe(product => {
          this.products = product.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as Product
            }
          })

          if (this.products.length === 0) {
            this.productService.searchProductsManufacturer(searchText).subscribe(product => {
              this.products = product.map(e => {
                return {
                  id: e.payload.doc.id,
                  ...e.payload.doc.data() as Product
                }
              })

              if (this.products.length === 0) {
                this.getProducts();
              }

            });
          }
        });
      }
    });
  }

  valueChange(value: string) {
    this.searchText = value;
    if (this.searchText === '') {
      this.getProducts();
    } else {
      this.searchProducts(this.searchText);
    }
  }

  addProduct() {
    this.router.navigate(['/panel/admin/products/add']);
  }

  editProduct(id: string) {
    this.router.navigate(['/panel/admin/products/edit/' + id]);
  }

  removeProduct(id: string, image: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      background: '#CCE2ED',
      confirmButtonColor: '#56B38F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.imageService.deleteImageByUrl(image);
        this.productService.deleteProduct(id);
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success',
        )
      }
    })
  }

  calcElemntWidth() {
    this.width = document.body.clientWidth;
    if (this.width < 400) {
      this.element = 1;
      this.navigation = false;
    } else if (this.width < 600) {
      this.element = 1.5;
      this.navigation = false;
    } else if (this.width < 1000) {
      this.element = 2;
      this.navigation = false;
    } else {
      this.element = 3;
      this.navigation = true;
    }
  }
}
