import {Component, Inject, inject, signal} from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {IngredientItemComponent} from "../../ingredient/ingredient-item/ingredient-item.component";
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  Observable,
  of,
  switchMap,
  tap
} from "rxjs";
import {Ingredient} from "../../ingredient/model/Ingredient";
import {IngredientService} from "../../ingredient/ingredient.service";
import {NutritionLog} from "../models/NutritionLog";
import {NutritionService} from "../nutrition.service";
import {ToastrService} from "ngx-toastr";
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
@Component({
  selector: 'app-nutrition-log',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    AsyncPipe,
    IngredientItemComponent,
  ],
  templateUrl: './nutrition-log.component.html',
  styleUrl: './nutrition-log.component.css'
})
export class NutritionLogComponent {
  nutritionPlanId=0;
  ingredientService=inject(IngredientService)
  nutritionService=inject(NutritionService)
  toaster=inject(ToastrService)
  dialogRef=inject(MatDialogRef<NutritionLogComponent>)
  searchIngredients$:Observable<Ingredient[]>
  isSearching=signal(false)
  hideResults=signal(true)
  ingredientFormControl=new FormControl('')
  nutritionLogForm=new FormGroup({
    'ingredient':new FormControl<Ingredient|null>(null,[Validators.required]),
    'quantity':new FormControl(0,[Validators.required]),
    'date':new FormControl(new Date(),[Validators.required])
  })


  constructor(@Inject(MAT_DIALOG_DATA) public data: any)
  {
    // retrieve the plan's id from the modal's parameters
    this.nutritionPlanId=this.data
    this.searchIngredients$ = this.ingredientFormControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((keyword) => {
        if(keyword!.trim()==""){
          return of([])
        }
        this.isSearching.set(true)
        this.hideResults.set(false)
        return this.ingredientService.searchIngredients(keyword!).pipe(
          map((results) => results.slice(0, 5)),
          finalize(() => {
            this.isSearching.set(false);
          })
        );
      })
    );

    this.ingredientService.selectedIngredient$.pipe(
      tap((ingredient)=>{
        this.nutritionLogForm.patchValue({
          'ingredient':ingredient
        })
        this.hideResults.set(true)
      })
    ).subscribe()
  }

  onSubmit() {
    if (!this.nutritionLogForm.valid) {
      this.toaster.error("Please fill in all the inputs !")
      return;
    }
    const ingredient = this.nutritionLogForm.get('ingredient')?.value;
    if (!ingredient || ingredient.id === undefined) {
      this.toaster.error("Please fill in all the inputs !")
      return;
    }
    const log = new NutritionLog(
      this.nutritionPlanId,
      null,
      ingredient.id,
      null,
      this.nutritionLogForm.get('date')?.value ??new Date(),
      this.nutritionLogForm.get('quantity')?.value??0
    );
    this.nutritionService.addNutritionLog(log).pipe(
      tap((result)=>{
        if(result){
          this.toaster.success("Nutrition log saved successfully");
          this.closeModal();
          return;
        }
        this.toaster.error("An error occurred, please try later ");
        this.closeModal();
      })

    ).subscribe();
  }

  closeModal() {
    this.dialogRef.close();
  }

}
