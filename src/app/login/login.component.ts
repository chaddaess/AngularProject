import {Component, inject} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router, RouterModule} from "@angular/router";
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UI_TEXTS} from "../Constants/Constants";
import {CredentialsDto} from "../auth/dto/credentials.dto";
import {HttpClient, HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  //authService = inject(AuthService);
  router = inject(Router);
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
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
      console.log(this.loginForm.value);
     this.authService.login(this.loginForm.value as CredentialsDto)
        .subscribe((data: any) => {
          if (this.authService.isLoggedIn()) {
            this.router.navigate(['']);
          }
          console.log(data);
        });
    }
  }
  protected readonly UI_TEXTS = UI_TEXTS;
}
