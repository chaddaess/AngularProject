import {Muscle} from "./app/models/muscle";

export interface MuscleResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Muscle[];
}
