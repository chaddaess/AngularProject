import {Component, inject, signal} from '@angular/core';
import {BehaviorSubject, catchError, finalize, map, Observable, tap} from "rxjs";
import {Ingredient} from "./model/Ingredient";
import {IngredientService} from "./ingredient.service";
import {AsyncPipe} from "@angular/common";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {IngredientListComponent} from "./ingredient-list/ingredient-list.component";


@Component({
  selector: 'app-ingredient',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterOutlet,
    IngredientListComponent
  ],
  templateUrl: './ingredient.component.html',
  styleUrl: './ingredient.component.css'
})
export class IngredientComponent {
  ingredientService=inject(IngredientService)
  router=inject(Router)
  activatedRoute=inject(ActivatedRoute)
  ingredients$:Observable<Ingredient[]>;
  limit=5; //TODO: find a better placement for this than hardcoding
  total=signal(0);
  isLoading=signal(false)
  constructor() {
    this.ingredients$ = this.activatedRoute.data.pipe(
      map((data) => (data['ingredients'])),
      map((response) => {
        this.total.set(response.total / this.limit);
        return response.ingredients;
      })
    )
    this.ingredientService.selectedIngredient$.pipe(
      tap((ingredient)=>{
        this.router.navigate(['ingredients',ingredient.id])
      })
    ).subscribe()
  }
  onPageChange(page: number) {
    let offset = (page - 1) * this.limit;
    this.isLoading.set(true)
    this.ingredients$ = this.ingredientService.getIngredients({ limit: this.limit, offset: offset }).pipe(
      map((response) => {
        this.total.set(response.total);
        return response.ingredients;
      }),
      finalize(() => {
        console.log("")
        this.isLoading.set(false);
      })
    );
  }



}
