import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideToastr} from "ngx-toastr";
import {authInterceptor} from "./auth-interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
    withInterceptors([authInterceptor]),
  ),
    provideRouter(routes),
    provideAnimationsAsync(),provideToastr({
    positionClass: 'toast-top-right',
    timeOut: 5000,
    preventDuplicates: true,
  })]
};
