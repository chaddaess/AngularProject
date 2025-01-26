export interface ExerciceSet {
  reps: number;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  rer: number; // Rating of Perceived Exertion Reserve
  completed?: boolean;
  notes?: string;
}
