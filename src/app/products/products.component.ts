import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductsComponent implements OnInit {

  products: Product[];

  width: number;
  element: number;
  navigation: boolean;

  searchText: string = '';

  constructor(private router: Router,
    private productService: ProductService) {
    this.calcElemntWidth();
  }

  ngOnInit(): void {
    this.getProducts();
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

  searchProduct(searchText: string) {
    this.productService.searchProducts(searchText).subscribe(product => {
      this.products = product.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Product
        }
      })

      if (this.products.length == 0) {
        this.productService.searchProductsManufacturer(searchText).subscribe(product => {
          this.products = product.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data() as Product
            }
          })
    
          if (this.products.length == 0) {
            this.productService.searchProductsCategory(searchText).subscribe(product => {
              this.products = product.map(e => {
                return {
                  id: e.payload.doc.id,
                  ...e.payload.doc.data() as Product
                }
              })

              if (this.products.length == 0) {
                this.getProducts();
              }
            });
          }
        });
      }
    });
  }

  valueChange($event) {
    this.searchText = $event;
    if (this.searchText == '') {
      this.getProducts();
    } else {
      this.searchProduct(this.searchText);
    }
  }

  viewInfo(id: string) {
    this.router.navigate(['view/info/product/' + id]);
  }

  calcElemntWidth() {
    this.width = document.body.clientWidth;
    if (this.width < 400) {
      this.element = 1.1;
      this.navigation = false;
    } else if (this.width < 600) {
      this.element = 2.5;
      this.navigation = false;
    } else if (this.width < 800) {
      this.element = 3.5;
      this.navigation = false;
    } else if (this.width < 1000) {
      this.element = 4.5;
      this.navigation = false;
    } else {
      this.element = 5.3;
      this.navigation = true;
    }
  }
}
