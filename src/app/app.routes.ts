import { Routes } from '@angular/router';
import {IngredientComponent} from "./ingredient/ingredient.component";
import {IngredientDetailsComponent} from "./ingredient/ingredient-details/ingredient-details.component";

export const routes: Routes = [
  {path:'ingredients',component:IngredientComponent,children:[
      {
        path:":id",
        component:IngredientDetailsComponent,
      }
    ]},
];
