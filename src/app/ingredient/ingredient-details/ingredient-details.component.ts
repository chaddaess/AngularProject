import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, EMPTY, finalize, Observable, switchMap, tap} from "rxjs";
import {IngredientService} from "../ingredient.service";
import {IngredientDetails} from "../model/IngerdientDetails";
import {AsyncPipe, NgClass} from "@angular/common";
import {FalsyValuesPipe} from "../../pipes/falsy-values.pipe";
import {LoadingSpinnerComponent} from "../../loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-ingredient-details',
  standalone: true,
  imports: [
    AsyncPipe,
    FalsyValuesPipe,
    NgClass,
    LoadingSpinnerComponent
  ],
  templateUrl: './ingredient-details.component.html',
  styleUrl: './ingredient-details.component.css'
})
export class IngredientDetailsComponent {
  activatedRoute=inject(ActivatedRoute)
  router=inject(Router)
  ingredientService=inject(IngredientService)
  ingredientDetails$:Observable<IngredientDetails>
  isLoading=signal(false)
  constructor() {
    this.ingredientDetails$=this.activatedRoute.params.pipe(
      tap(()=>{this.isLoading.set(true)}),
      switchMap((params)=>{
        return this.ingredientService.getIngredientDetails(+params['id']).pipe(
          catchError(()=>(EMPTY)),
          finalize(()=>{this.isLoading.set(false)})
        )
      })
    )
  }

}
