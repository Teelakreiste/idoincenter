import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/services/alerts.service';
import { AuthService } from 'src/app/services/auth.service';
// import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  fieldTextType: boolean;
  loginForm: FormGroup;
  emailPattern: any = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  private login: boolean = false;
  constructor(private router: Router,
    private authService: AuthService,
    private alertsService: AlertsService) { 
    this.loginForm = this.createFormGroup();
  }

  ngOnInit(): void {
  }

  createFormGroup() {
    return new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.pattern(this.emailPattern)]),
      password: new FormControl(null, [Validators.required])
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const resp = await this.authService.signIn(this.loginForm.value.email, this.loginForm.value.password).catch(error => {
        this.alertsService.messageWithImage('Error', error.message.replace('Firebase: ', ''), '../../../assets/images/undraw_warning_re_eoyh.svg', false, 10000);
      });
      if (resp) {
        // const token = await resp.user.getIdToken();
        // const decodedToken = jwt_decode(token);
        // console.log(decodedToken['password']);
        this.authService.isLogged().then((user) => {
          if (user) {
            localStorage.setItem('token', user.uid);
          } else {
            localStorage.removeItem('token');
          }
        });
        this.router.navigate(['/']);
        this.alertsService.messageWithImage('', '', '../../../assets/images/undraw_welcome_cats_thqn.svg', false, 1000);
      }
    }
  }

  signUp() {
    this.router.navigate(['/session/sing-up']);
  }

  onForgotPassword() {
    this.router.navigate(['/session/forgot-password']);
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  get user() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

}
