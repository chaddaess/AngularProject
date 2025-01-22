import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {authGuard} from "./auth/auth.guard";
import {UserSettingsComponent} from "./user-settings/user-settings.component";
import {APP_ROUTES} from "../config/routes.config";

export const routes: Routes = [
  {
    path: APP_ROUTES.login, component: LoginComponent
  },
  {
    path: APP_ROUTES.preferences, component: UserSettingsComponent , canActivate: [authGuard]
  }
];
