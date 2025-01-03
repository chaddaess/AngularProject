import { Component } from '@angular/core';
import { ListComponent } from './list/list.component';
import { ExerciseService } from '../services/exercise.service';
import { Observable, Subscription, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ExerciseGridComponent } from './exercise-grid/exercise-grid.component';

@Component({
  selector: 'app-exercise-page',
  standalone: true,
  imports: [ListComponent,CommonModule,ExerciseGridComponent],
  templateUrl: './exercise-page.component.html',
  styleUrl:'./exercise-page.component.css'
})
export class ExercisePageComponent {
  categories$: Observable<string[]> = this.exerciseService.getCategories();
  equipments$: Observable<string[]> = this.exerciseService.getEquipments();
  muscles$: Observable<string[]> = this.exerciseService.getMuscles();
  exercises$: Observable<string[]> = this.exerciseService.getExercises();
  
  exercisesList: { name: string; description: string; equipment: string; muscles: string[] }[] = [];
  categoriesList: { name: string; selected: boolean }[] = [];
  equipmentsList: { name: string; selected: boolean }[] = [];
  musclesList: { name: string; selected: boolean }[] = [];

  private categoriesSubscription!: Subscription;
  private equipmentsSubscription!: Subscription;
  private musclesSubscription!: Subscription;
  private exercisesSubscription!: Subscription;

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

      this.exercisesSubscription = this.exerciseService.getExercises().subscribe((response: any) => {
        console.log('API Response:', response);
        this.exercisesList = response.map((exercise: any) => {
          const exerciseData = exercise.exercises.find((ex: { language: number; }) => ex.language === 2);
          return {
            name: exerciseData?.name || 'No name available',
            description: exerciseData?.description || 'No description available',
            category: exercise.category?.name || 'N/A',
            muscles: exercise.muscles.map((muscle: { name: any; }) => muscle.name) || [],
            equipment: exercise.equipment.map((eq: { name: any; }) => eq.name) || [],
          };
        });
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
    if (this.exercisesSubscription) {
      this.exercisesSubscription.unsubscribe();
    }
  }

  onItemToggle(itemName: string, itemList: { name: string, selected: boolean }[]) {
    const item = itemList.find((cat) => cat.name === itemName);
    if (item) {
      item.selected = !item.selected;
    }
  }
  
  
}
