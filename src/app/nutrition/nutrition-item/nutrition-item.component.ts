import { Component, Input } from '@angular/core';
import { NutritionService } from '../nutrition.service';
import { NutritionPlan } from '../models/getNutritionPlansResponse.model';

@Component({
  selector: 'app-nutrition-item',
  standalone: true,
  imports: [],
  templateUrl: './nutrition-item.component.html',
  styleUrl: './nutrition-item.component.css'
})
export class NutritionItemComponent {
  @Input() nutritionPlan=new NutritionPlan();

  constructor(private nutritionService: NutritionService) {}

  onClick(){
    this.nutritionService.selectNutritionPlan(this.nutritionPlan)
  }
}
