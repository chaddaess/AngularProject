import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {API} from "../../config/api.config";
import {Settings} from "../Settings";
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of, shareReplay,
  Subject,
  switchMap,
} from "rxjs";
import {Ingredient} from "./model/Ingredient";
import {IngredientImage} from "./model/IngredientImage";
import {IngredientDetails} from "./model/IngredientDetails";
import {IngredientResult} from "./model/IngredientResult";
import {CONST} from "../../config/const.config";

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  http = inject(HttpClient)
  #selectedIngredient = new Subject<Ingredient>()
  selectedIngredient$ = this.#selectedIngredient.asObservable()
  constructor() {
  }

  getIngredients(settings: Settings): Observable<IngredientResult> {
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
              image: response.results[0]?.image || CONST.defaultIngredientImage
            })),
            catchError(() => of({
              ...ingredient,
              image: CONST.defaultIngredientImage
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
      catchError(() => {
        const ingredient=new Ingredient();
        ingredient.errorMessage="No ingredients are available at the moment !"
        return of({total: 0, ingredients: [ingredient]});
      }),
    );
  }

  getIngredientDetails(id: number):Observable<IngredientDetails> {
    return this.http.get<IngredientDetails>(`${API.ingredient_details}/${id}`).pipe(
      shareReplay(1),
      catchError(()=>{
        const ingredientDetails=new IngredientDetails();
        ingredientDetails.errorMessage="This ingredient's details are not  available at the moment !"
        return of(ingredientDetails)
      })
    )
  }

  searchIngredients(keyword: string):Observable<Ingredient[]> {
    return this.http.get<{
      suggestions: [{ data: Ingredient }]
    }>(`${API.search_ingredients}?language=english&term=${keyword}`).pipe(
      map((result) => {
        const ingredientObjects = result.suggestions
        return ingredientObjects.map((ingredientObject) => {
            const ingredient = ingredientObject.data
          ingredient.image = ingredient.image
            ? `${API.api_host_prefix}${ingredient.image}`
            : CONST.defaultIngredientImage;
            return ingredient;
          }
        )
      }),
      catchError(()=>{
        const ingredient=new Ingredient();
        ingredient.errorMessage="We're having trouble searching this ingredient , please try again!";
        return of([ingredient])
      })
    )
  }

  selectIngredient(ingredient: Ingredient):void {
    this.#selectedIngredient.next(ingredient)
  }
}
