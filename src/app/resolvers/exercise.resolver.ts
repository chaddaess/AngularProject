import { ResolveFn } from '@angular/router';
import { ExerciseService } from '../services/exercise.service';  
import { inject } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Exercise } from '../models/exercise.model';

export const exerciseResolver: ResolveFn<Observable<any>> = (route, state) => {
  console.log("resolving cat/eq/musc/ex");
  const exerciseService = inject(ExerciseService);
   // forkJoin fetches all the data 
   return forkJoin({
    categories: exerciseService.getCategories(),
    equipments: exerciseService.getEquipments(),
    muscles: exerciseService.getMuscles(),
    exercises: exerciseService.fetchExercises(1, 12),
  });
}
  ;
