import {Component, inject} from '@angular/core';
import {RoutineService} from "../services/routine.service";
import {RoutineFormComponent} from "../routine-form/routine-form.component";
import {Routine} from "../models/routine";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ExerciseService} from "../services/exercise.service";

@Component({
  selector: 'app-routines',
  standalone: true,
  imports: [
    RoutineFormComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './routines.component.html',
  styleUrl: './routines.component.css'
})
export class RoutinesComponent {
    // routineService: RoutineService = inject(RoutineService);
    // exerciseService: ExerciseService = inject(ExerciseService);
    // routines : Routine[] | null = null;
    //
    // ngOnInit(){
    //   this.routineService.getRoutines().subscribe(res =>{
    //     console.log(res);
    //     this.routines = res;
    //   })
    //   this.exerciseService.getExercises().subscribe(res =>{
    //     console.log(res);
    //   })
    // }
}
