import {Muscle} from "./app/model/muscle";

export interface MuscleResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Muscle[];
}
