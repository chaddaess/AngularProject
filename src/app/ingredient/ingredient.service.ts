import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {API} from "../../config/api.config";
import {Settings} from "../Settings";
import {catchError, forkJoin, map, Observable, of, Subject, switchMap, tap} from "rxjs";
import {Ingredient} from "./model/Ingredient";
import {IngredientImage} from "./model/IngredientImage";
import {IngredientDetails} from "./model/IngerdientDetails";

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  http=inject(HttpClient)
  #selectedIngredient=new Subject<Ingredient>()
  selectedIngredient$=this.#selectedIngredient.asObservable()


  getIngredients(settings: Settings): Observable<{ total: number, ingredients: Ingredient[] }> {
    const { limit, offset } = settings;

    return this.http.get<{ count: number, results: Ingredient[] }>(`${API.ingredient}?limit=${limit}&offset=${offset}`).pipe(
      map(response => ({
        total: response.count,
        ingredients: response.results
      })),
      switchMap(({ total, ingredients }) => {
        const imageRequests = ingredients.map(ingredient =>
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
            total,
            ingredients: ingredientsWithImages
          }))
        );
      })
    );
  }

  getIngredientDetails(id:number){
    console.log("fetching details...")
    return this.http.get<IngredientDetails>(`${API.ingredient_details}/${id}`);
  }

  selectIngredient(ingredient:Ingredient){
    console.log('service click ;)')
    this.#selectedIngredient.next(ingredient)
  }


  constructor() { }
}
