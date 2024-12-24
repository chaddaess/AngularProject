import {Component, Input} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {Ingredient} from "../model/Ingredient";
import {IngredientItemComponent} from "../ingredient-item/ingredient-item.component";

@Component({
  selector: 'app-ingredient-list',
  standalone: true,
  imports: [
    AsyncPipe,
    IngredientItemComponent
  ],
  templateUrl: './ingredient-list.component.html',
  styleUrl: './ingredient-list.component.css'
})
export class IngredientListComponent {
  @Input() ingredients:Ingredient[]|null=[]
}
