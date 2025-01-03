import { Component } from '@angular/core';
import { ListComponent } from './list/list.component';
import { ExerciseService } from '../services/exercise.service';
import { Observable, Subscription, map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exercise-page',
  standalone: true,
  imports: [ListComponent,CommonModule],
  templateUrl: './exercise-page.component.html',
  styleUrl:'./exercise-page.component.css'
})
export class ExercisePageComponent {
  categories$: Observable<string[]> = this.exerciseService.getCategories();
  equipments$: Observable<string[]> = this.exerciseService.getEquipments();
  muscles$: Observable<string[]> = this.exerciseService.getMuscles();

  categoriesList: { name: string; selected: boolean }[] = [];
  equipmentsList: { name: string; selected: boolean }[] = [];
  musclesList: { name: string; selected: boolean }[] = [];

  private categoriesSubscription!: Subscription;
  private equipmentsSubscription!: Subscription;
  private musclesSubscription!: Subscription;


  constructor(private exerciseService: ExerciseService) {}

  ngOnInit() {
    this.categoriesSubscription = this.categories$.subscribe((data: string[]) => {
      this.categoriesList = data.map((categoryName) => ({
        name: categoryName,
        selected: false, 
      }));
    });

    this.equipmentsSubscription = this.equipments$.subscribe((data: string[]) => {
      this.equipmentsList = data.map((equipmentName) => ({
        name: equipmentName,
        selected: false, 
      }));
    });

    this.musclesSubscription = this.muscles$.subscribe((data: string[]) => {
      this.musclesList = data.map((muscleName) => ({
        name: muscleName,
        selected: false, 
      }));
    });

  }

  ngOnDestroy() {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
    if (this.equipmentsSubscription) {
      this.equipmentsSubscription.unsubscribe();
    }
    if (this.musclesSubscription) {
      this.musclesSubscription.unsubscribe();
    }
  }

  onItemToggle(itemName: string, itemList: { name: string, selected: boolean }[]) {
    const item = itemList.find((cat) => cat.name === itemName);
    if (item) {
      item.selected = !item.selected;
    }
  }
  
  
}
