import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  userForm: FormGroup;
  userData: User = {
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
  emailPattern: any = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  passwordPattern: any = /^(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}$/;
  fieldTextType: boolean = false;
  repeatFieldTextType: boolean = false;

  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private alertsService: AlertsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.userForm = this.createFormGroup();
  }

  ngOnInit(): void {
  }

  createFormGroup() {
    return this.formBuilder.group({
      email: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.pattern(this.emailPattern)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.pattern(this.passwordPattern), Validators.maxLength(20)]),
      password2: new FormControl(null, [Validators.required])
    },
      {
        validators: this.mustMatch('password', 'password2')
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

  signIn() {
    this.router.navigate(['/session/sing-in']);
  }

  async onSubmit() {
    if (this.userForm.valid) {
      this.userData.email = this.userForm.value.email;
      this.userData.password = this.userForm.value.password;
      const resp = await this.authService.signUp(this.userData).catch(error => {
        this.alertsService.messageWithImage('Error', error.message.replace('Firebase: ', ''), '../../../assets/images/undraw_warning_re_eoyh.svg', false, 10000);
      });
      if (resp) {
        const path = 'users';
        const id = resp.user.uid;
        this.userData.uid = id;
        this.userData.password = null;
        await this.firebaseService.createDocument(this.userData, path, id);
        this.resetForm();
      }
    }
  }

  resetForm() {
    this.alertsService.messageWithImage('Success', 'Account created successfully', '../../../assets/images/undraw_awesome_rlvy.svg', false, 1000);
    this.userForm.reset();
    this.router.navigate(['/session/sing-in']);
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  repeatToggleFieldTextType() {
    this.repeatFieldTextType = !this.repeatFieldTextType;
  }

  get email() {
    return this.userForm.get('email');
  }

  get password() {
    return this.userForm.get('password');
  }

  get password2() {
    return this.userForm.get('password2');
  }
}
