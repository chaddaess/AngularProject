import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {APP_ROUTES} from "../../config/routes.config";

export const authGuard: CanActivateFn = (route, state) => {
  const  authService  =  inject(AuthService);
  const  router  =  inject(Router);
  if (authService.isLoggedIn()) {
    return true;
  }
  router.navigate([APP_ROUTES.login]);
  return false;
};
