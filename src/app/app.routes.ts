import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {authGuard} from "./auth/auth.guard";
import {UserSettingsComponent} from "./user-settings/user-settings.component";
import {APP_ROUTES} from "../config/routes.config";
import {IngredientComponent} from "./ingredient/ingredient.component";
import {IngredientDetailsComponent} from "./ingredient/ingredient-details/ingredient-details.component";
import {ingredientResolver} from "./ingredient/resolvers/ingredient-resolver";
import { BmiCalculatorComponent } from './bmi-calculator/bmi-calculator.component';

export const routes: Routes = [
  {
    path: APP_ROUTES.login, component: LoginComponent
  },
  {
    path: APP_ROUTES.preferences, component: UserSettingsComponent , canActivate: [authGuard]
  },
  {
    path: 'ingredients', component: IngredientComponent, children: [
      {
        path: ":id",
        component: IngredientDetailsComponent,
      }
    ],
    resolve:{ingredients:ingredientResolver}
  },
  {
    path: APP_ROUTES.bmiCalculator, component: BmiCalculatorComponent 
  },
];
