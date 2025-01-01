import {Routes} from '@angular/router';
import {IngredientComponent} from "./ingredient/ingredient.component";
import {IngredientDetailsComponent} from "./ingredient/ingredient-details/ingredient-details.component";
import {ingredientResolver} from "./ingredient/resolvers/ingredient-resolver";

export const routes: Routes = [
  {
    path: 'ingredients', component: IngredientComponent, children: [
      {
        path: ":id",
        component: IngredientDetailsComponent,
      }
    ],
    resolve:{ingredients:ingredientResolver}
  },
];
