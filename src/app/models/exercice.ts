import {ExerciceSet} from "./exerciceSet";

export interface Exercise {
  id: string;
  exerciseId: string;  // Reference to exercise in exercise library
  exerciseName: string;
  sets: ExerciceSet[];
  notes?: string;
  restBetweenSets?: number; // in seconds
  order: number;
}
