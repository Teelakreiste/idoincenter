import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';

import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-show-category',
  templateUrl: './show-category.component.html',
  styleUrls: ['./show-category.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ShowCategoryComponent implements OnInit {

  width: number;
  element: number;
  navigation: boolean;
  categories: Category[];

  constructor(private router: Router,
    private categoryService: CategoryService) {
    this.width = 1200;
    this.element = 5.3;
    this.navigation = false;
  }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(category => {
      this.categories = category.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Category
        }
      })
    });
  }

  addCategory() {
    this.router.navigate(['/panel/admin/categories/add']);
  }

  editCategory(id: string) {
    this.router.navigate(['/panel/admin/categories/edit/' + id]);
  }

  removeCategory(id: string) {
    this.categoryService.deleteCategory(id);
  }

}