import {ResolveFn} from "@angular/router";
import {Observable, map} from "rxjs";
import {inject} from "@angular/core";
import { NutritionService } from "../nutrition.service";
import { NutritionPlan } from "../models/getNutritionPlansResponse.model";

export const nutritionResolver: ResolveFn<{total:number, nutritionPlans:NutritionPlan[]}> = (): Observable<{total:number, nutritionPlans: NutritionPlan[]}> => {
  const nutritionService = inject(NutritionService);
  return nutritionService.getNutritionPlans({limit: 5, offset: 0}).pipe(map(response => {
    return { total: response.count, nutritionPlans: response.results }
  }))
}
