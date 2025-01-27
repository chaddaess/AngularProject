import { Routes } from '@angular/router';
import { ExercisePageComponent } from './exercise-page/exercise-page.component';
import { exerciseResolver } from './resolvers/exercise.resolver';

export const routes: Routes = [
    {
        path: 'exercises', component: ExercisePageComponent/*, children: [
          {
            path: ":id",
            component: IngredientDetailsComponent,
          }
        ]*/,
        resolve:{exercises: exerciseResolver}
      },
   
];
