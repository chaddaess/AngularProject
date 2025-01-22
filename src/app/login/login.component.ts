import {Component, inject} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router, RouterModule} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LOGIN_PAGE_TEXTS} from "../Constants/Constants";
import {CredentialsDto} from "../auth/dto/credentials.dto";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  router = inject(Router);
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })
  constructor( private authService : AuthService
  ) {
  }
  get email() {
    return this.loginForm.get('email');
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
     this.authService.login(this.loginForm.value as CredentialsDto)
        .subscribe((data: any) => {
          if (this.authService.isLoggedIn()) {
            this.router.navigate(['']);
          }
        });
    }
  }
  protected readonly LOGIN_PAGE_TEXTS = LOGIN_PAGE_TEXTS;
}
