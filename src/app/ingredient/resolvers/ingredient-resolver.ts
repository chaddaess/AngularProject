import {ResolveFn} from "@angular/router";
import {Ingredient} from "../model/Ingredient";
import {Observable} from "rxjs";
import {inject} from "@angular/core";
import {IngredientService} from "../ingredient.service";

export const ingredientResolver: ResolveFn<{total:number,ingredients:Ingredient[]}> = (): Observable<{total:number,ingredients:Ingredient[]}> => {
  const ingredientService = inject(IngredientService);
  return ingredientService.getIngredients({limit: 5, offset: 0})
}
