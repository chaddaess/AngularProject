import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, EMPTY, Observable, switchMap} from "rxjs";
import {IngredientService} from "../ingredient.service";
import {IngredientDetails} from "../model/IngerdientDetails";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-ingredient-details',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './ingredient-details.component.html',
  styleUrl: './ingredient-details.component.css'
})
export class IngredientDetailsComponent {
  activatedRoute=inject(ActivatedRoute)
  router=inject(Router)
  ingredientService=inject(IngredientService)
  ingredientDetails$:Observable<IngredientDetails>
  constructor() {
    this.ingredientDetails$=this.activatedRoute.params.pipe(
      switchMap((params)=>{
        return this.ingredientService.getIngredientDetails(+params['id']).pipe(
          catchError(()=>(EMPTY))
        )
      })
    )
  }

}
