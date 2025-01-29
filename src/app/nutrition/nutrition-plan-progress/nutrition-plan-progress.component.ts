import {Component, inject, Input, signal} from '@angular/core';
import {NutritionService} from "../nutrition.service";
import {NutritionPlan} from "../models/getNutritionPlansResponse.model";
import {finalize, forkJoin, map, Observable, of, switchMap, tap} from "rxjs";
import {IngredientService} from "../../ingredient/ingredient.service";
import {ToastrService} from "ngx-toastr";
import {AsyncPipe} from "@angular/common";
import {FalsyValuesPipe} from "../../pipes/falsy-values.pipe";
import {LoadingSpinnerComponent} from "../../loading-spinner/loading-spinner.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-nutrition-plan-progress',
  standalone: true,
  imports: [
    AsyncPipe,
    FalsyValuesPipe,
    LoadingSpinnerComponent
  ],
  templateUrl: './nutrition-plan-progress.component.html',
  styleUrl: './nutrition-plan-progress.component.css'
})
export class NutritionPlanProgressComponent {
  @Input() nutritionPlanId=0
  nutritionService=inject(NutritionService)
  ingredientService=inject(IngredientService)
  toaster=inject(ToastrService)
  activatedRoute=inject(ActivatedRoute)
  nutritionPlanProgress$=new Observable<NutritionPlan>()
  isLoading=signal(false)
  constructor() {
    //retrieve the nutrition plan's id
    this.activatedRoute.params.pipe(
      map((param)=>{
        this.nutritionPlanId=Number(param['id']||0);
      }),
    ).subscribe()


    //calculate the nutritional value across all logs of this plan
    this.nutritionPlanProgress$ = this.nutritionService.getNutritionLogs(this.nutritionPlanId).pipe(
      switchMap((logs) => {
        this.isLoading.set(true)
        if (!logs || logs.length === 0) {
          // no logs were found, return default (empty)  nutritional value
          this.isLoading.set(false);
          return of(new NutritionPlan(undefined, undefined, undefined, undefined, 0, 0, 0, 0, 0, undefined));
        }
        // logs were found
        // fetch ingredient details for all logs in parallel using forkJoin
        return forkJoin(
          // extract the details of each log's ingredient
          logs.map((log) =>
            this.ingredientService.getIngredientDetails(log.ingredient).pipe(
              map((ingredientDetails)=>{
                if(ingredientDetails.errorMessage){
                  this.toaster.error("Error in retrieving logs, please try again!");
                  return null;
                }
                return ingredientDetails;
              }),

            )
          )
        )
        // once all ingredient detail requests have completed, process the results
        .pipe(
          map((ingredientDetailsList) => {
            // initialize a new NutritionPlan with default values (zeroed-out)
            const nutritionPlanProgress = new NutritionPlan(undefined, undefined, undefined, undefined, 0, 0, 0, 0, 0, undefined);
            // calculate the final achieved nutritional values  by summing the nutrient values of all retrieved ingredient details
            for (const details of ingredientDetailsList) {
              if (details) {
                nutritionPlanProgress.goal_energy! += details.energy ?? 0;
                nutritionPlanProgress.goal_protein! += Number(details.protein) || 0;
                nutritionPlanProgress.goal_fat! += Number(details.fat) || 0;
                nutritionPlanProgress.goal_carbohydrates! += Number(details.carbohydrates) || 0;
                nutritionPlanProgress.goal_fiber! += Number(details.fiber) || 0;
              }
            }
            return nutritionPlanProgress;
          })
        );
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

}
