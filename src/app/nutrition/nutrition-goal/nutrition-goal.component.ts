import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NutritionService } from '../nutrition.service';
import { NutritionPlan } from '../models/getNutritionPlansResponse.model';
import {finalize, map, Observable, switchMap, tap} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FalsyValuesPipe } from "../../pipes/falsy-values.pipe";
import { LoadingSpinnerComponent } from "../../loading-spinner/loading-spinner.component";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-nutrition-goal',
  standalone: true,
  imports: [AsyncPipe, FalsyValuesPipe, LoadingSpinnerComponent],
  templateUrl: './nutrition-goal.component.html',
  styleUrl: './nutrition-goal.component.css'
})
export class NutritionGoalComponent {
  activatedRoute=inject(ActivatedRoute)
  router=inject(Router)
  toaster=inject(ToastrService)
  nutritionPlanService=inject(NutritionService)
  nutritionPlanDetails$:Observable<NutritionPlan>
  isLoading=signal(false)
  constructor() {
    this.nutritionPlanDetails$=this.activatedRoute.params.pipe(
      tap(()=>{this.isLoading.set(true)}),
      switchMap((param)=>{
        return this.nutritionPlanService.getNutritionPlan(param['id']).pipe(
          map((nutritionPlan)=>{
            if (nutritionPlan.error_message){
              this.toaster.error(nutritionPlan.error_message);
            }
            return nutritionPlan;
          }),
          finalize(()=>{this.isLoading.set(false)})
        )
      })
    )
  }
}
