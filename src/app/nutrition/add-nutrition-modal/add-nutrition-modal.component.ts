import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NutritionService } from '../nutrition.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

type formFieldNames = "description" | "goal_energy" | "goal_protein" | "goal_carbohydrates" | "goal_fat" | "goal_fiber"

@Component({
  selector: 'app-add-nutrition-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-nutrition-modal.component.html',
  styleUrl: './add-nutrition-modal.component.css'
})
export class AddNutritionModalComponent {
  addNutritionPlanForm = new FormGroup({
    description: new FormControl('', [Validators.required]),
    goal_energy: new FormControl(0, [Validators.required]),
    goal_protein: new FormControl(0, [Validators.required]),
    goal_carbohydrates: new FormControl(0, [Validators.required]),
    goal_fat: new FormControl(0, [Validators.required]),
    goal_fiber: new FormControl(0, [Validators.required]),
  });
  constructor(public dialogRef: MatDialogRef<AddNutritionModalComponent>, private nutritionService: NutritionService) { }
  
  closeModal() {
    this.dialogRef.close();
  }

  shouldDisplayRequiredError(fieldName: formFieldNames): boolean {
    const fieldControl = this.addNutritionPlanForm.controls[fieldName];
    return fieldControl.hasError('required')
      && fieldControl.touched;
  }

  addNutritionPlan() {
    const requestBody = {...this.addNutritionPlanForm.value, only_logging: true}
    this.nutritionService.addNutritionPlan(requestBody).subscribe(result => {
      if(result)
        this.closeModal();

      return;
    })
  }
}
