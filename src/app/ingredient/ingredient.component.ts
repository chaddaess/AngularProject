import {Component, inject} from '@angular/core';
import { Observable, tap} from "rxjs";
import {Ingredient} from "./model/Ingredient";
import {IngredientService} from "./ingredient.service";
import {AsyncPipe} from "@angular/common";
import {Router,RouterOutlet} from "@angular/router";
import {IngredientListComponent} from "./ingredient-list/ingredient-list.component";


@Component({
  selector: 'app-ingredient',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterOutlet,
    IngredientListComponent
  ],
  templateUrl: './ingredient.component.html',
  styleUrl: './ingredient.component.css'
})
export class IngredientComponent {
  ingredientService=inject(IngredientService)
  router=inject(Router)
  ingredients$:Observable<Ingredient[]>;
  limit:number;
  constructor() {
      this.limit=10;
      this.ingredients$=this.ingredientService.getIngredients({limit:this.limit,offset:0});
      this.ingredientService.selectedIngredient$.pipe(
        tap((ingredient)=>{
          this.router.navigate(['ingredients',ingredient.id])
        })
      ).subscribe()
  }
  onPageChange(page:any){
    let offset=(page-1)*this.limit;
    this.ingredients$=this.ingredientService.getIngredients({limit:this.limit,offset:offset})
  }


}
