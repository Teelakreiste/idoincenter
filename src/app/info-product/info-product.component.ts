import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-info-product',
  templateUrl: './info-product.component.html',
  styleUrls: ['./info-product.component.css']
})
export class InfoProductComponent implements OnInit {

  products: any;

  constructor(private productService: ProductService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.productService.getProduct(this.getId()).subscribe(product => {
      this.products = product;
    });
  }

  getId() {
    return this.activatedRoute.snapshot.paramMap.get('id');
  }

  back() {
    window.history.back();
  }
}
