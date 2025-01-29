import {Component, inject, OnDestroy} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router, RouterModule} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CredentialsDto} from "../auth/dto/credentials.dto";
import {HttpClientModule} from "@angular/common/http";
import {CONST, UI_TEXTS} from "../../config/const.config";
import {catchError, EMPTY, Subject, tap} from "rxjs";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{
  router = inject(Router);
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })
  protected errorMessage: string|null = null;
  protected readonly LOGIN_PAGE_TEXTS = UI_TEXTS;
  private authService = inject(AuthService);
  constructor() {
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
      this.errorMessage = null;
      this.authService.login(this.loginForm.value as CredentialsDto).pipe(
        tap(() => {
          if (this.authService.isLoggedIn()) {
            this.router.navigate(['']);
          }
        }),
        catchError((error) => {
          if (error.status === 401) {
            this.errorMessage = UI_TEXTS.LOGIN_ERROR;
          } else {
            this.errorMessage = UI_TEXTS.API_ERROR;
          }
          return EMPTY;
        })
      ).subscribe();
    }
  }

}
