import {FormArray, FormControl, FormGroup} from "@angular/forms";

export type Weekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"; // TODO: impose this on the days
export type WeightUnit = "kg" | "lb"; // TODO: impose this on the weight unit field

export type SetForm = FormGroup<{
  reps: FormControl<number>,
  weight: FormControl<number>,
  weightUnit: FormControl<string>,
  rer: FormControl<number>,
  completed: FormControl<boolean>,
  notes: FormControl<string>
}>

export type RoutineForm = FormGroup<{
  description: FormControl<string>, scheduledDays: FormArray<ExerciseDays>, exercises: FormArray<ExerciseForm>
}>

export type ExerciseDays = FormGroup<{
  exerciseDay: FormControl<string>,
}>

export type ExerciseForm = FormGroup<{
  exerciseName: FormControl<string>,
  exerciseId: FormControl<number>,
  sets: FormArray<SetForm>,
  notes: FormControl<string>,
  restBetweenSets: FormControl<number>,
  numberOfSets: FormControl<number>,
}>
