import {Routine} from "./models/routine";

export interface RoutineResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Routine[];
}
