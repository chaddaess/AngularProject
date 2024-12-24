import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {API} from "../../config/api.config";
import {Settings} from "../Settings";
import {catchError, forkJoin, map, Observable, of, switchMap} from "rxjs";
import {Ingredient} from "./model/Ingredient";
import {IngredientImage} from "./model/IngredientImage";

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  http=inject(HttpClient)

  getIngredients(settings: Settings): Observable<Ingredient[]> {
    const { limit, offset } = settings;
    return this.http.get<{ results: Ingredient[] }>(`${API.ingredient}?limit=${limit}&offset=${offset}`).pipe(
      map(response => response.results),
      switchMap(ingredients => {
        const imageRequests = ingredients.map(ingredient =>
          this.http.get<{results:IngredientImage[]}>(`${API.ingredient_image}?ingredient_id=685637`).pipe(
            map(response => ({
              ...ingredient,
              image: response.results[0].image,
            })),
            catchError(()=>(of({
              ...ingredient,
              image: "assets/default-ing.png"
            })))
          )
        );
        return forkJoin(imageRequests)
      })

    );
  }


  constructor() { }
}
