import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-product',
  templateUrl: './info-product.component.html',
  styleUrls: ['./info-product.component.css']
})
export class InfoProductComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  back() {
    window.history.back();
  }
}
