import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {authGuard} from "./auth/auth.guard";
import {UserSettingsComponent} from "./user-settings/user-settings.component";

export const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'userSettings', component: UserSettingsComponent , canActivate: [authGuard]
  }
];
