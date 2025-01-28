import { Component, inject, signal } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AddNutritionModalComponent } from './add-nutrition-modal/add-nutrition-modal.component';
import { NutritionService } from './nutrition.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { combineLatest, finalize, map, Observable, tap, timer } from 'rxjs';
import { NutritionPlan } from './models/getNutritionPlansResponse.model';
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";
import { NutritionListComponent } from "./nutrition-list/nutrition-list.component";
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-nutrition',
  standalone: true,
  imports: [LoadingSpinnerComponent, 
    NutritionListComponent, 
    AsyncPipe,
    RouterOutlet
  ],
  templateUrl: './nutrition.component.html',
  styleUrl: './nutrition.component.css'
})
export class NutritionComponent {
  dialogConfig = new MatDialogConfig();
  modalDialog: MatDialogRef<AddNutritionModalComponent, any> | undefined;
  nutritionService = inject(NutritionService)
  router=inject(Router)
  activatedRoute=inject(ActivatedRoute)
  nutritionPlans$:Observable<NutritionPlan[]>;
  limit=5;
  total=signal(0);
  isLoading=signal(false)
  isSearching=signal(false)

  constructor(public matDialog: MatDialog) {
    this.nutritionPlans$ = this.activatedRoute.data.pipe(
      map((data) => {
        return data['nutritionPlans']
      }),
      map((response) => {
        console.log(response)
        this.total.set(Math.ceil(response.total / this.limit));
        return response.nutritionPlans;
      })
    )
    this.nutritionService.selectednutritionPlan$.pipe(
      tap((nutritionPlan)=>{
        this.router.navigate(['nutrition', nutritionPlan?.id])
      })
    ).subscribe()
  }
  
  onPageChange(page: number) {
    let offset = (page - 1) * this.limit;
    const $loaderDelay = timer(500) //loader should appear for at least 500ms to avoid flickering
    const data$= this.nutritionService.getNutritionPlans({ limit: this.limit, offset: offset }).pipe(
      map((response) => {
        this.total.set(Math.ceil(response.count / this.limit));
        return response.results;
      }),
    );
    this.isLoading.set(true)
    this.nutritionPlans$ = combineLatest([data$, $loaderDelay]).pipe(
      map(([nutritionPlans]) => nutritionPlans),
      finalize(() => {
        this.isLoading.set(false);
      })
    )
  }

  openModal() {
    this.dialogConfig.id = "projects-modal-component";
    this.modalDialog = this.matDialog.open(AddNutritionModalComponent, this.dialogConfig);
  }
}
