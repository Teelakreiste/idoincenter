import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  emailPattern: any = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router) {
    this.forgotPasswordForm = this.createFormGroup();
  }

  ngOnInit(): void {
  }

  createFormGroup() {
    return this.formBuilder.group({
      email: new FormControl(null, [Validators.required, Validators.pattern(this.emailPattern)])
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
    }
  }

  signIn() {
    this.router.navigate(['/session/sing-in']);
  }

  get email() { return this.forgotPasswordForm.get('email'); }
}
