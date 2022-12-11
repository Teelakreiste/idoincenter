import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Manufacturer } from 'src/app/models/manufacturer.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ManufacturerService } from 'src/app/services/manufacturer.service';

import Swal from 'sweetalert2'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-show-manufacturers',
  templateUrl: './show-manufacturers.component.html',
  styleUrls: ['./show-manufacturers.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ShowManufacturersComponent implements OnInit {

  width: number;
  element: number;
  navigation: boolean;
  manufacturers: Manufacturer[];
  isAdmin: boolean = false;
  searchText: string = '';

  constructor(private router: Router,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private manufacturerService: ManufacturerService) {
    this.isAdmin = false;
    this.user();
    this.calcElemntWidth();
  }

  ngOnInit(): void {
    this.getManufacturers();
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

  getManufacturers() {
    this.manufacturerService.getManufacturers().subscribe(manufacturer => {
      this.manufacturers = manufacturer.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Manufacturer
        }
      })
    });
  }

  searchManufacturer(searchText: string) {
    this.manufacturerService.searchManufacturer(searchText).subscribe(manufacturer => {
      this.manufacturers = manufacturer.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Manufacturer
        }
      })

      if (this.manufacturers.length === 0) {
        this.getManufacturers();
      }
    });
  }

  valueChange(value: string) {
    this.searchText = value;
    if (this.searchText === '') {
      this.getManufacturers();
    } else {
      this.searchManufacturer(this.searchText);
    }
  }

  addManufacturer() {
    this.router.navigate(['/panel/admin/manufacturers/add']);
  }

  editManufacturer(id: string) {
    this.router.navigate(['/panel/admin/manufacturers/edit/' + id]);
  }

  removeManufacturer(id: string) {
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
        this.manufacturerService.deleteManufacturer(id);
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
    if (this.width < 480) {
      this.element = 1.5;
      this.navigation = false;
    } else if (this.width < 600) {
      this.element = 2.5;
      this.navigation = false;
    } else if (this.width < 800) {
      this.element = 1.5;
      this.navigation = false;
    } else if (this.width < 1000) {
      this.element = 1.3;
      this.navigation = false;
    } else {
      this.element = 2.3;
      this.navigation = true;
    }
  }

}
