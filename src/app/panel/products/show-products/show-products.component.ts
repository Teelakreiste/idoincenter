import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ImageService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';

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

  constructor(private router: Router,
    private imageService: ImageService,
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

  addProduct() {
    this.router.navigate(['/panel/admin/products/add']);
  }

  editProduct(id: string) {
    this.router.navigate(['/panel/admin/products/edit/' + id]);
  }

  removeProduct(id: string, image: string) {
    this.imageService.deleteImageByUrl(image);
    this.productService.deleteProduct(id);
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
