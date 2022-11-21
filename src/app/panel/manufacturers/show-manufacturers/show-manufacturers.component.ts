import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Manufacturer } from 'src/app/models/manufacturer.model';
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

  constructor(private router: Router,
    private manufacturerService: ManufacturerService) {
    this.calcElemntWidth();
  }

  ngOnInit(): void {
    this.getManufacturers();
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
