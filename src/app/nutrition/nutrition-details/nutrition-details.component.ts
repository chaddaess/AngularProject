import {Component, inject} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {NutritionLogComponent} from "../nutrition-log/nutrition-log.component";
import {NutritionGoalComponent} from "../nutrition-goal/nutrition-goal.component";
import {NutritionPlanProgressComponent} from "../nutrition-plan-progress/nutrition-plan-progress.component";
import {ActivatedRoute} from "@angular/router";
import {map} from "rxjs";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-nutrition-details',
  standalone: true,
  imports: [
    NutritionGoalComponent,
    NutritionPlanProgressComponent,
    AsyncPipe
  ],
  templateUrl: './nutrition-details.component.html',
  styleUrl: './nutrition-details.component.css'
})
export class NutritionDetailsComponent {
  dialogConfig = new MatDialogConfig();
  modalDialog: MatDialogRef<NutritionLogComponent, any> | undefined;
  matDialog=inject(MatDialog)
  activatedRoute=inject(ActivatedRoute)
  nutritionPlanId=0;

  constructor() {

    //retrieve the nutrition plan's id
    this.activatedRoute.params.pipe(
      map((param)=>{
        this.nutritionPlanId=Number(param['id']||0);
      }),
    ).subscribe()
  }
  openModal() {
    this.dialogConfig.id = "nutrition-log-modal";
    //pass the plan's id as a parameter to the log popup
    this.dialogConfig.data = this.nutritionPlanId;
    this.modalDialog = this.matDialog.open(NutritionLogComponent, this.dialogConfig);
  }

}
