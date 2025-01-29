import {Component, inject} from '@angular/core';
import {FormArray, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {RoutineService} from '../services/routine.service';
import {ExerciseDays, ExerciseForm, RoutineForm, SetForm} from "./formTypes";
import {WorkoutService} from "../services/workout.service";
import {WorkoutDto} from "../auth/dto/workout.dto";
import {debounceTime, distinctUntilChanged, tap} from "rxjs";
import {DayOfWeek, RoutineDto} from "../auth/dto/routine.dto";
import {ExerciseService} from "../services/exercise.service";
import {Router} from "@angular/router";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-routine-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './routine-form.component.html',
})
export class RoutineFormComponent {
  protected searchResults: any[][] = [];
  protected formSubmitted = false;
  private readonly routineService = inject(RoutineService);
  private readonly workoutService = inject(WorkoutService);
  private readonly exerciseService = inject(ExerciseService);
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly routineForm: RoutineForm = this.fb.group({
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    scheduledDays: this.fb.array<ExerciseDays>([], [Validators.required, Validators.minLength(1)]),
    exercises: this.fb.array<ExerciseForm>([this.generateExerciseForm()], [Validators.required, Validators.minLength(1)])
  });
  private readonly router = inject(Router);
  private workout: WorkoutDto | null = null;

  protected get exercises(): FormArray<ExerciseForm> {
    return this.routineForm?.controls.exercises;
  }

  protected get scheduledDays(): FormArray<ExerciseDays> {
    return this.routineForm?.controls.scheduledDays;
  }

  ngOnInit() {
    this.workoutService.getDefaultWorkout().subscribe({
      next: (workout) => {
        this.workout = workout;
        console.log('Default workout loaded:', workout);
      }, error: (error) => {
        console.error('Error loading default workout:', error);
      }
    });
    this.searchResults[0] = [];

    this.setupExerciseSearchSubscription(0);
  }

  protected getErrorMessage(control: any): string {
    if (!control.errors) return '';

    const errors = {
      required: 'This field is required',
      minlength: `Minimum length is ${control.errors.minlength?.requiredLength} characters`,
      maxlength: `Maximum length is ${control.errors.maxlength?.requiredLength} characters`,
      min: `Minimum value is ${control.errors.min?.min}`,
      max: `Maximum value is ${control.errors.max?.max}`,
    };

    const firstError = Object.keys(control.errors)[0];
    return errors[firstError as keyof typeof errors] || 'Invalid input';
  }

  protected isFieldInvalid(control: any): boolean {
    return (control.invalid && (control.dirty || control.touched || this.formSubmitted));
  }

  protected generateExerciseForm(): ExerciseForm {
    return this.fb.group({
      exerciseName: ['', [Validators.required]],
      exerciseId: [0, [Validators.required, Validators.min(1)]],
      sets: this.fb.array<SetForm>([this.createSetGroup()], [Validators.required, Validators.minLength(1)]),
      notes: ['', [Validators.maxLength(200)]],
      restBetweenSets: [60, [Validators.required, Validators.min(0), Validators.max(300)]],
      numberOfSets: [3, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  protected createSetGroup(): SetForm {
    return this.fb.group({
      reps: [0, [Validators.required, Validators.min(1), Validators.max(100)]],
      weight: [0, [Validators.required, Validators.min(0), Validators.max(1000)]],
      weightUnit: ['kg', [Validators.required]],
      rer: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
      completed: [false],
      notes: ['', [Validators.maxLength(100)]]
    });
  }

  protected addExercise(): void {
    const newForm = this.generateExerciseForm();
    this.exercises.push(newForm);
    const newIndex = this.exercises.length - 1;
    this.searchResults[newIndex] = [];
    this.setupExerciseSearchSubscription(newIndex);
  }

  protected onSearchExercise(event: Event, index: number) {
    const searchTerm = (event.target as HTMLInputElement).value;
    if (searchTerm && searchTerm.length >= 2) {
      this.exerciseService.searchExercises(searchTerm).subscribe(results => {
        this.searchResults[index] = results;
      });
    } else {
      this.searchResults[index] = [];
    }
  }

  protected selectExercise(exercise: any, index: number) {
    const exerciseForm = this.exercises.at(index);
    exerciseForm.patchValue({
      exerciseName: exercise.name, exerciseId: exercise.id
    });
    this.searchResults[index] = [];
  }

  protected deleteExercise(exerciseIndex: number): void {
    this.exercises.removeAt(exerciseIndex);
    this.searchResults.splice(exerciseIndex, 1);
  }

  protected addSet(exerciseIndex: number): void {
    const setsArray = this.exercises.at(exerciseIndex)?.controls?.sets;
    if (setsArray?.length > 0) {
      const setToDuplicate = setsArray.at(-1);
      setsArray.push(this.fb.group(setToDuplicate.value) as SetForm);
    } else this.exercises.at(exerciseIndex)?.controls?.sets?.push(this.createSetGroup());
  }

  protected deleteSet(exerciseIndex: number, setIndex: number): void {
    this.exercises.at(exerciseIndex)?.controls?.sets?.removeAt(setIndex);
  }

  protected updateScheduledDays(event: Event, day: string): void {
    const checkbox = event.target as HTMLInputElement;
    const scheduledDays = this.routineForm.controls.scheduledDays;

    if (checkbox.checked) {
      scheduledDays.push(this.fb.group({
        exerciseDay: this.fb.control(day)
      }));
    } else {
      const index = scheduledDays.controls.findIndex(control => control.value.exerciseDay === day);
      if (index !== -1) {
        scheduledDays.removeAt(index);
      }
    }
  }

  protected onSubmit(): void {
    if (!this.routineForm.valid || !this.workout?.id) {
      this.highlightErrors();
      return;
    }

    const transformedDays = this.routineForm.value.scheduledDays!.map(({exerciseDay}) => DayOfWeek[exerciseDay as keyof typeof DayOfWeek]);
    const newRoutine: RoutineDto = {
      training: this.workout.id, description: this.routineForm.value.description!, day: transformedDays
    }
    this.routineService.createRoutine(newRoutine).pipe(tap(routine => console.log('Routine created:', routine)),)
      .subscribe({
        next: (results) => {
          console.log('Successfully created routine, exercises, and sets:', results);
          this.router.navigate(['/']);
        }, error: (error) => {
          console.error('Error in creation process:', error);
        }
      });
  }

  private setupExerciseSearchSubscription(index: number) {
    const exerciseControl = this.exercises.at(index);
    exerciseControl.get('exerciseName')?.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchTerm => {
      if (searchTerm && searchTerm.length >= 2) {
        this.exerciseService.searchExercises(searchTerm).subscribe(results => {
          this.searchResults[index] = results;
        });
      } else {
        this.searchResults[index] = [];
      }
    });
  }


  private highlightErrors(): void {
    Object.keys(this.routineForm.controls).forEach(key => {
      const control = this.routineForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });

    // Mark all exercises and their sets as touched
    this.exercises.controls.forEach(exercise => {
      Object.keys(exercise.controls).forEach(key => {
        const control = exercise.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });

      const setsArray = exercise.get('sets') as FormArray<SetForm>;
      setsArray.controls.forEach(set => {
        Object.keys(set.controls).forEach(key => {
          const control = set.get(key);
          if (control?.invalid) {
            control.markAsTouched();
          }
        });
      });
    });
  }
}
