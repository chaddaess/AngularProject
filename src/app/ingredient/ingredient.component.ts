import {Component, inject, signal} from '@angular/core';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  Observable, of,
  switchMap,
  tap,
  timer
} from "rxjs";
import {Ingredient} from "./model/Ingredient";
import {IngredientService} from "./ingredient.service";
import {AsyncPipe} from "@angular/common";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {IngredientListComponent} from "./ingredient-list/ingredient-list.component";
import {LoadingSpinnerComponent} from "../loading-spinner/loading-spinner.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {IngredientItemComponent} from "./ingredient-item/ingredient-item.component";


@Component({
  selector: 'app-ingredient',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterOutlet,
    IngredientListComponent,
    LoadingSpinnerComponent,
    ReactiveFormsModule,
    IngredientItemComponent
  ],
  templateUrl: './ingredient.component.html',
  styleUrl: './ingredient.component.css'
})
export class IngredientComponent {
  ingredientService=inject(IngredientService)
  router=inject(Router)
  activatedRoute=inject(ActivatedRoute)
  ingredients$:Observable<Ingredient[]>;
  searchIngredients$:Observable<Ingredient[]>
  limit=5; //TODO: find a better placement for this than hardcoding
  total=signal(0);
  isLoading=signal(false)
  isSearching=signal(false)
  form=new FormControl<string>('')
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

    this.searchIngredients$ = this.form.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((keyword) => {
        if(keyword!.trim()==""){
          return of([])
        }
        this.isSearching.set(true)
        return this.ingredientService.searchIngredients(keyword!).pipe(
          map((results) => results.slice(0, 5)),
          finalize(() => {
            this.isSearching.set(false);
          })
        );
      })
    );
  }
  onPageChange(page: number) {
    let offset = (page - 1) * this.limit;
    const $loaderDelay=timer(500) //loader should appear for at least 500ms to avoid flickering
    const data$= this.ingredientService.getIngredients({ limit: this.limit, offset: offset }).pipe(
      map((response) => {
        this.total.set(response.total);
        return response.ingredients;
      }),
    );
    this.isLoading.set(true)
    this.ingredients$=combineLatest([data$,$loaderDelay]).pipe(
      map(([ingredients]) => ingredients),
      finalize(() => {
        this.isLoading.set(false);
      })
    )
  }



}
