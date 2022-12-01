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
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

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
    role: ['read']
  }
  profileForm: FormGroup;
  private emailPattern: any = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  private passwordPattern: any = /^(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}$/;
  oldFieldTextType: boolean = false;
  fieldTextType: boolean = false;
  repeatFieldTextType: boolean = false;
  imgSrc: string;
  imageUrl: string = '';
  private selectedImage: any = null;

  constructor(private firebaseService: FirebaseService,
    private authService: AuthService,
    private imageService: ImageService,
    private alertsService: AlertsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.profileForm = this.createFormGroup();
  }

  ngOnInit(): void {
  }

  createFormGroup() {
    return this.formBuilder.group({
      uid: new FormControl('', []),
      firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      userName: new FormControl('', [Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      phoneNum: new FormControl('', [Validators.minLength(3)]),
      mobileNum: new FormControl('', [Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)]),
      password2: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)]),
      birthday: new FormControl('', []),
      photoURL: new FormControl('', []),
      read: new FormControl('', []),
      write: new FormControl('', []),
    },
      {
        validators: this.mustMatch('password', 'password2')
      }
    );
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

  onSubmit() {
    if (this.profileForm.valid) {
      this.updateImage();
    }
  }

  setUserData(img: string) {
    this.userData.firstName = this.profileForm.get('firstName').value;
    this.userData.lastName = this.profileForm.get('lastName').value;
    this.userData.userName = this.profileForm.get('userName').value;
    this.userData.email = this.profileForm.get('email').value;
    this.userData.phoneNum = this.profileForm.get('phoneNum').value;
    this.userData.mobileNum = this.profileForm.get('mobileNum').value;
    this.userData.password = this.profileForm.get('password').value;
    this.userData.birthday = this.profileForm.get('birthday').value;
    this.userData.photoURL = img;
    if (this.profileForm.get('read').value && this.profileForm.get('write').value) {
      this.userData.role.push('read');
      this.userData.role.push('write');
    } else if (this.profileForm.get('read').value) {
      this.userData.role.push('read');
    } else if (this.profileForm.get('write').value) {
      this.userData.role.push('write');
    }
  }

  async createUserProfile(img: string) {
    const path = 'users';
    this.profileForm.value.photoURL = img;
    this.setUserData(img);
    const resp = await this.authService.signUp(this.userData).catch(error => {
      this.alertsService.messageWithImage('Error', error.message.replace('Firebase: ', ''), '../../../assets/images/undraw_warning_re_eoyh.svg', false, 10000);
    });
    if (resp) {
      const id = resp.user.uid;
      this.userData.uid = id;
      this.userData.password = null;
      await this.firebaseService.createDocument(this.userData, path, id);
      this.resetForm();
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
            this.createUserProfile(url);
          });
        })
      ).subscribe();
    } else {
      this.createUserProfile(this.imageUrl);
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

  resetForm() {
    this.alertsService.messageWithImage('Success', 'Account created successfully', '../../../assets/images/undraw_awesome_rlvy.svg', false, 1000);
    this.profileForm.reset();
    this.router.navigate(['/panel/admin/']);
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

  get password() {
    return this.profileForm.get('password');
  }

  get password2() {
    return this.profileForm.get('password2');
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
}
