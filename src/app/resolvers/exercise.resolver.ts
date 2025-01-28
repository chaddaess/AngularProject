import { ResolveFn } from '@angular/router';
import { ExerciseService } from '../services/exercise.service';  
import { inject } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';

export const exerciseResolver: ResolveFn<Observable<any>> = (route, state) => {
  console.log("Resolving cat/eq/musc/ex");

  const exerciseService = inject(ExerciseService);
  const savedState = localStorage.getItem('exercisePageState');

  if (savedState) {
    const parsedState = JSON.parse(savedState);
    //console.log(parsedState.categories);
    const cacheArray = parsedState.cache || [];
    const cache = new Map<number, any>(cacheArray);
    const currentPage = parsedState.currentPage || 1;

    if (cache.has(currentPage)) {
      return of({
        muscles: parsedState.muscles || [],
        categories: parsedState.categories || [],
        equipments: parsedState.equipments || [],
        exercises: cache.get(currentPage)
      });
    }
  }

  return forkJoin({
    categories: exerciseService.getCategories(),
    equipments: exerciseService.getEquipments(),
    muscles: exerciseService.getMuscles(),
    exercises: exerciseService.fetchExercises(1, 12),
  });
};
