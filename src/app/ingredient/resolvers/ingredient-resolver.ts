import {ResolveFn} from "@angular/router";
import {Ingredient} from "../model/Ingredient";
import {map, Observable} from "rxjs";
import {inject} from "@angular/core";
import {IngredientService} from "../ingredient.service";

export const ingredientResolver: ResolveFn<{total:number,ingredients:Ingredient[]}> = (
  route,
  state): Observable<{total:number,ingredients:Ingredient[]}> => {
  console.log("resolving...")
  const ingredientService = inject(IngredientService);
  return ingredientService.getIngredients({limit: 5, offset: 0})
}
