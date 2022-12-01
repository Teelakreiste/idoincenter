import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { FirebaseService } from 'src/app/services/firebase.service';

import Swal from 'sweetalert2'
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
  isAdmin: boolean = false;

  constructor(private router: Router,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private categoryService: CategoryService) {
    this.isAdmin = false;
    this.user();
    this.calcElemntWidth();
  }

  ngOnInit(): void {
    this.getCategories();
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
        this.categoryService.deleteCategory(id);
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }

  calcElemntWidth() {
    this.width = document.body.clientWidth;
    if (this.width < 400) {
      this.element = 1.5;
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
