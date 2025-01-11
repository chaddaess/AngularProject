import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AppComponent} from "./app.component";
import {HttpClientModule} from "@angular/common/http";

export const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  }
];
