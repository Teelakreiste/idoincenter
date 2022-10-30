import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import { Router } from '@angular/router';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductsComponent implements OnInit {

  width: number;
  element: number;
  navigation: boolean;

  constructor(private router: Router) { 
    this.width = 1200;
    this.element = 5.3;
    this.navigation = true;
  }

  ngOnInit(): void {
  }


  viewInfo(id: string) {
    this.router.navigate(['view/info/product/' + id]);
  }
}
