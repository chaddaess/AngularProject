import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {API} from "../../config/api.config";
import {Settings} from "../Settings";
import {BehaviorSubject, catchError, finalize, forkJoin, map, Observable, of, Subject, switchMap} from "rxjs";
import {Ingredient} from "./model/Ingredient";
import {IngredientImage} from "./model/IngredientImage";
import {IngredientDetails} from "./model/IngerdientDetails";

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  http = inject(HttpClient)
  #selectedIngredient = new Subject<Ingredient>()
  selectedIngredient$ = this.#selectedIngredient.asObservable()
  constructor() {
  }

  getIngredients(settings: Settings): Observable<{ total: number, ingredients: Ingredient[] }> {
    const {limit, offset} = settings;
    return this.http.get<{
      count: number,
      results: Ingredient[]
    }>(`${API.ingredient}?limit=${limit}&offset=${offset}`).pipe(
      switchMap(({count, results}) => {
        const imageRequests = results.map(ingredient =>
          this.http.get<{ results: IngredientImage[] }>(`${API.ingredient_image}?ingredient_id=${ingredient.id}`).pipe(
            map(response => ({
              ...ingredient,
              image: response.results[0]?.image || "assets/default-ing.png"
            })),
            catchError(() => of({
              ...ingredient,
              image: "assets/default-ing.png"
            }))
          )
        );

        return forkJoin(imageRequests).pipe(
          map(ingredientsWithImages => ({
            total: count,
            ingredients: ingredientsWithImages
          }))
        );
      }),
      catchError((error) => {
        console.error("Error fetching ingredients:", error);
        return of({total: 0, ingredients: []});
      }),
      finalize(() => {
        console.log("doneee service ")
      })
    );
  }

  getIngredientDetails(id: number) {
    return this.http.get<IngredientDetails>(`${API.ingredient_details}/${id}`);
  }

  searchIngredients(keyword: string) {
    return this.http.get<{
      suggestions: [{ data: Ingredient }]
    }>(`${API.search_ingredients}?language=english&term=${keyword}`).pipe(
      map((result) => {
        const ingredientObjects = result.suggestions
        return ingredientObjects.map((ingredientObject) => {
            const ingredient = ingredientObject.data
          ingredient.image = ingredient.image
            ? `${API.api_host_prefix}${ingredient.image}`
            : 'assets/default-ing.png';
            return ingredient;
          }
        )
      }),
    )
  }

  selectIngredient(ingredient: Ingredient) {
    this.#selectedIngredient.next(ingredient)
  }
}
