import {Component, inject} from '@angular/core';
import {Observable} from "rxjs";
import {Ingredient} from "./model/Ingredient";
import {IngredientService} from "./ingredient.service";
import {AsyncPipe} from "@angular/common";


@Component({
  selector: 'app-ingredient',
  standalone: true,
  imports: [
    AsyncPipe,
  ],
  templateUrl: './ingredient.component.html',
  styleUrl: './ingredient.component.css'
})
export class IngredientComponent {
  ingredientService=inject(IngredientService)
  ingredients$:Observable<Ingredient[]>;
  limit:number;
  constructor() {
      this.limit=10;
      this.ingredients$=this.ingredientService.getIngredients({limit:this.limit,offset:0})
  }
  onPageChange(page:any){
    let offset=(page-1)*this.limit;
    this.ingredients$=this.ingredientService.getIngredients({limit:this.limit,offset:offset})
  }


}
