import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AlertsService } from 'src/app/services/alerts.service';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {
  private userData: User = {
    uid: null,
    firstName: null,
    lastName: null,
    userName: null,
    email: null,
    phoneNum: null,
    mobileNum: null,
    password: null,
    photoURL: null,
    birthday: null,
    role: null
  }
  isEdit: boolean = true;
  profileForm: FormGroup;
  pwForm: FormGroup;
  private emailPattern: any = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  private passwordPattern: any = /^(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}$/;
  oldFieldTextType: boolean = false;
  fieldTextType: boolean = false;
  repeatFieldTextType: boolean = false;
  imgSrc: string;
  imageUrl: string = '';
  private selectedImage: any = null;
  isAdmin: boolean = false;
  isOwner: boolean = false;

  constructor(private firebaseService: FirebaseService,
    private authService: AuthService,
    private imageService: ImageService,
    private alertsService: AlertsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.profileForm = this.createFormGroup();
    this.pwForm = this.createPwForm();
  }

  async ngOnInit() {
    this.getCurrentUser();
    this.getDatosUser(this.getId());
  }

  getDatosUser(uid: string) {
    const path = 'users';
    const id = uid;
    this.firebaseService.getDocumentById<User>(path, id).subscribe(data => {
      if (data) {
        this.userData = data;
        this.updateForm(this.userData);
      }
    });
  }

  createFormGroup() {
    return this.formBuilder.group({
      uid: new FormControl('', []),
      firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      userName: new FormControl('', [Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      phoneNum: new FormControl('', [Validators.minLength(3)]),
      mobileNum: new FormControl('', [Validators.required, Validators.minLength(3)]),
      birthday: new FormControl('', []),
      photoURL: new FormControl('', []),
      read: new FormControl('', []),
      write: new FormControl('', []),
    });
  }

  createPwForm() {
    return this.formBuilder.group({
      oldPassword: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)]),
      password: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)]),
      password2: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)]),
    },
      {
        validators: this.mustMatch('password', 'password2')
      }
    );
  }

  updateForm(data: User) {
    this.imgSrc = data.photoURL;
    this.imageUrl = data.photoURL;
    this.profileForm = this.formBuilder.group({
      uid: new FormControl(data.uid, []),
      firstName: new FormControl(data.firstName, [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl(data.lastName, [Validators.required, Validators.minLength(3)]),
      userName: new FormControl(data.userName, [Validators.minLength(3)]),
      email: new FormControl(data.email, [Validators.required, Validators.pattern(this.emailPattern)]),
      phoneNum: new FormControl(data.phoneNum, [Validators.minLength(3)]),
      mobileNum: new FormControl(data.mobileNum, [Validators.required, Validators.minLength(3)]),
      birthday: new FormControl(data.birthday, []),
      photoURL: new FormControl('', []),
      read: new FormControl(data.role?.includes('read'), []),
      write: new FormControl(data.role?.includes('write'), []),
    });
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors?.['mustMatch']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  getCurrentUser() {
    this.authService.isLogged().then((user) => {
      if (user) {
        // console.log(user.uid);
        // console.log(this.getId());
        if (user.uid == this.getId()) {
          this.isOwner = true;
        }
        this.firebaseService.getDocumentById<User>('users', user.uid).subscribe(data => {
          if (data) {
            if (data.role.includes('admin')) {
              this.isAdmin = true;
            }
          }
        });
        //}
      }
    });
  }

  onSubmit() {
    if (this.isEdit) {
      this.isEdit = false;
    } else {
      if (this.profileForm.valid) {
        this.updateImage();
      }
      this.isEdit = true;
    }
  }

  async pwSubmit() {
    // if (this.isAdmin) {
    //   this.pwForm.controls['oldPassword'].setErrors(null);
    // }
    if (this.pwForm.valid) {
      // if (!this.isAdmin) {
      console.log('no es admin');
      const oldPw = await this.authService.verifyOldPassword(this.pwForm.value.oldPassword);
      console.log(oldPw);
      if (oldPw) {
        this.updatePassword();
      } else {
        this.alertsService.errorMessage('The old password is incorrect');
      }
      // } else {
      //   console.log('admin');
      //   this.updatePassword();
      // }

    }
  }

  updatePassword() {
    const newPassword = this.pwForm.value.password;
    this.authService.changePassword(newPassword).then(() => {
      this.alertsService.successMessage('Password updated successfully');
    }).catch((error) => {
      this.alertsService.errorMessage(error.message);
    });
  }

  reset() {
    if (!this.isEdit) {
      this.isEdit = true;
    }
    this.updateForm(this.userData);
  }

  async remove() {
    const confirm = await this.alertsService.confirmMessage('Are you sure you want to delete your account?');
    if (confirm['isConfirmed']) {
      this.authService.deleteUser().then(() => {
        this.firebaseService.deleteDocument('users', this.userData.uid);
        localStorage.removeItem('token');
        this.alertsService.successMessage('Account deleted successfully');
        this.router.navigate(['/']);
      }).catch((error) => {
        this.alertsService.errorMessage(error.message);
      });
    }
  }

  setUserData(img: string) {
    this.userData.firstName = this.profileForm.get('firstName').value;
    this.userData.lastName = this.profileForm.get('lastName').value;
    this.userData.userName = this.profileForm.get('userName').value;
    this.userData.email = this.profileForm.get('email').value;
    this.userData.phoneNum = this.profileForm.get('phoneNum').value;
    this.userData.mobileNum = this.profileForm.get('mobileNum').value;
    this.userData.birthday = this.profileForm.get('birthday').value;
    this.userData.photoURL = img;
    this.asignRole();
  }

  asignRole() {
    for (let index = 0; index < this.userData.role.length; index++) {
      if (this.userData.role[index] != 'admin') {
        this.userData.role.pop();
      }
    }
    if (!this.profileForm.get('read').value && !this.profileForm.get('write').value) {
      this.userData.role.pop();
      this.userData.role.push('read');
    } else {
      if (this.profileForm.get('read').value) {
        this.userData.role.push('read');
      }
      if (this.profileForm.get('write').value) {
        this.userData.role.push('write');
      }
    }
  }

  updateProfile(img: string) {
    const path = 'users';
    const id = this.getId();
    this.profileForm.value.photoURL = img;
    this.setUserData(img);
    const resp = this.firebaseService.updateDocument(this.userData, path, id);
    if (resp) {
      this.alertsService.messagePosition('profile updated successfully', 'success', 'top-end', 1500);
    }
  }

  updateImage() {
    if (this.selectedImage != null) {
      var filePath = `users/${this.profileForm.value.uid}/${this.profileForm.value.userName}-${new Date().getTime()}`;
      const fileRef = this.imageService.getRef(filePath);
      if (this.imageUrl != '' && this.imageUrl != null) {
        this.imageService.deleteImageByUrl(this.imageUrl);
      }
      this.imageService.uploadImage(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            // this.index = true;
            this.profileForm['photoURL'] = url;
            this.updateProfile(url);
          });
        })
      ).subscribe();
    } else {
      this.updateProfile(this.imageUrl);
    }
  }

  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    } else {
      this.imgSrc = '';
      this.selectedImage = null;
    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  repeatToggleFieldTextType() {
    this.repeatFieldTextType = !this.repeatFieldTextType;
  }

  oldToggleFieldTextType() {
    this.oldFieldTextType = !this.oldFieldTextType;
  }

  back() {
    window.history.back();
  }

  getId() {
    return this.activatedRoute.snapshot.paramMap.get('id');
  }

  get email() {
    return this.profileForm.get('email');
  }

  get firstName() {
    return this.profileForm.get('firstName');
  }

  get lastName() {
    return this.profileForm.get('lastName');
  }

  get userName() {
    return this.profileForm.get('userName');
  }

  get phoneNum() {
    return this.profileForm.get('phoneNum');
  }

  get mobileNum() {
    return this.profileForm.get('mobileNum');
  }

  get birthday() {
    return this.profileForm.get('birthday');
  }

  get photoURL() {
    return this.profileForm.get('photoURL');
  }

  get role() {
    return this.profileForm.get('role');
  }

  get read() {
    return this.profileForm.get('read');
  }

  get write() {
    return this.profileForm.get('write');
  }

  get oldPassword() {
    return this.pwForm.get('oldPassword');
  }

  get password() {
    return this.pwForm.get('password');
  }

  get password2() {
    return this.pwForm.get('password2');
  }

}
