import {NavbarComponent} from "./navbar/navbar.component";
import {LoginComponent} from "./login/login.component";
import {Component, inject} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet} from '@angular/router';
import {LoaderComponent} from "./loader-page/loader.component";
import { BmiCalculatorComponent } from './bmi-calculator/bmi-calculator.component';
import {APP_TITLE} from "../config/const.config";
import {APP_ROUTES} from "../config/routes.config";
import {NgClass} from "@angular/common";
import { ExercisePageComponent } from './exercise-page/exercise-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, LoginComponent, LoaderComponent, BmiCalculatorComponent, ExercisePageComponent, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title : string = APP_TITLE;
  isLoading = false;
  includeContainer=true;
  router=inject(Router)
  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading=true
      }
      else if(event instanceof NavigationEnd ){
        this.includeContainer=!(event.url==="/"+APP_ROUTES.login||event.url==="/"+APP_ROUTES.preferences)
        this.isLoading=false;
      }
      else if (
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      )
      {
        this.isLoading=false;
      }
    });
  }
}
