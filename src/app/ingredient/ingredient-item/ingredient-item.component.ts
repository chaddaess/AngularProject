import {Component, inject, Input} from '@angular/core';
import {Ingredient} from "../model/Ingredient";
import {IngredientService} from "../ingredient.service";
import {CONST} from "../../../config/const.config";

@Component({
  selector: 'app-ingredient-item',
  standalone: true,
  imports: [],
  templateUrl: './ingredient-item.component.html',
  styleUrl: './ingredient-item.component.css'
})
export class IngredientItemComponent {
  ingredientService=inject(IngredientService)
  @Input() ingredient=new Ingredient()

  onClick(){
    this.ingredientService.selectIngredient(this.ingredient)
  }
  onImageLoadingError(){
    this.ingredient.image=CONST.defaultIngredientImage
  }
}
