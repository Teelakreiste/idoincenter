import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.css']
})
export class ShowUsersComponent implements OnInit {

  width: number;
  element: number;
  navigation: boolean;
  users: User[];

  constructor(private router: Router,
    private imageService: ImageService,
    private firebaseService: FirebaseService) {
      this.calcElemntWidth();
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.firebaseService.getDocuments('users').subscribe(user => {
      this.users = user.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as User
        }
      })
    });
  }

  addUser() {
    this.router.navigate(['panel/admin/users/add']);
  }

  editUser(id: string) {
    this.router.navigate(['panel/admin/users/edit/', id]);
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
