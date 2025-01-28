import {Exercise} from "./app/models/exercice";

export interface ExerciseResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Exercise[];
}
