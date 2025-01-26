import {Component, inject} from '@angular/core';
import {FormArray, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {RoutineService} from '../services/routine.service';
import {ExerciseDays, ExerciseForm, RoutineForm, SetForm} from "./formTypes";

@Component({
  selector: 'app-routine-form',
  standalone: true,
  imports: [ReactiveFormsModule,],
  templateUrl: './routine-form.component.html',
})
export class RoutineFormComponent {
  private readonly routineService = inject(RoutineService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly routineForm: RoutineForm = this.fb.group({
    name: ['', [Validators.required]],
    description: '',
    scheduledDays: this.fb.array<ExerciseDays>([], [Validators.required, Validators.minLength(1)]),
    exercises: this.fb.array<ExerciseForm>([this.generateExerciseForm()])
  });

  protected get exercises(): FormArray<ExerciseForm> {
    return this.routineForm.controls.exercises;
  }

  protected generateExerciseForm(): ExerciseForm {
    return this.fb.group({
      exerciseName: ['', Validators.required],
      sets: this.fb.array<SetForm>([this.createSetGroup()]),
      notes: [''],
      restBetweenSets: [60],
      numberOfSets: [3, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  protected addExercise(): void {
    this.exercises.push(this.generateExerciseForm());
  }

  protected deleteExercise(exerciseIndex: number): void {
    this.exercises.removeAt(exerciseIndex);
  }

  protected createSetGroup(): SetForm {
    return this.fb.group({
      reps: [0, [Validators.required, Validators.min(1)]],
      weight: [0, [Validators.required, Validators.min(0)]],
      weightUnit: ['kg', Validators.required],
      rer: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
      completed: [false],
      notes: ['']
    });
  }

  protected addSet(exerciseIndex: number): void {
    this.exercises.at(exerciseIndex)?.controls?.sets?.push(this.createSetGroup());
  }

  protected duplicateSet(exerciseIndex: number, setIndex: number): void {
    const setsArray = this.exercises.at(exerciseIndex)?.controls?.sets;
    const setToDuplicate = setsArray.at(setIndex);
    setsArray.push(this.fb.group(setToDuplicate.value) as SetForm);
  }

  protected deleteSet(exerciseIndex: number, setIndex: number): void {
    this.exercises.at(exerciseIndex)?.controls?.sets?.removeAt(setIndex);
  }

  protected onSubmit(): void {
    if (this.routineForm.valid) {
      console.log(this.routineForm);

      // const formValue = this.routineForm.value;
      //
      // this.routineService.createRoutine(formValue).subscribe({
      //   next: (routine) => {
      //     // Handle success
      //   }, error: (error) => {
      //     // Handle error
      //   }
      // });
    }
  }
}
