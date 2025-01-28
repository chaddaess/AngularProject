import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NutritionService } from '../nutrition.service';
import { NutritionPlan } from '../models/getNutritionPlansResponse.model';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FalsyValuesPipe } from "../../pipes/falsy-values.pipe";
import { LoadingSpinnerComponent } from "../../loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-nutrition-details',
  standalone: true,
  imports: [AsyncPipe, FalsyValuesPipe, LoadingSpinnerComponent],
  templateUrl: './nutrition-details.component.html',
  styleUrl: './nutrition-details.component.css'
})
export class NutritionDetailsComponent {
  activatedRoute=inject(ActivatedRoute)
  router=inject(Router)
  nutritionPlanService=inject(NutritionService)
  nutritionPlanDetails$:Observable<NutritionPlan>
  isLoading=signal(false)
  constructor() {
    this.nutritionPlanDetails$= this.nutritionPlanService.selectednutritionPlan$
  }
}
