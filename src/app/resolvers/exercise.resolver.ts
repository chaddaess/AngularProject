import { ResolveFn } from '@angular/router';
import { ExerciseService } from '../services/exercise.service';  
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Exercise } from '../models/exercise.model';

export const exerciseResolver: ResolveFn<Observable<Exercise[]>> = (route, state) => {
  console.log("preloading first 12 exercises...");
  const exerciseService = inject(ExerciseService);
  return exerciseService.fetchExercises(0, 12); 

};
