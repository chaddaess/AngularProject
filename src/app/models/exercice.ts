import {Muscle} from "./muscle";

export interface Exercise {
  id?: number;
  uuid?: string;
  created?: string;
  // category: Category;
  muscles?: Muscle[];
  musclesSecondary?: Muscle[];
  errorMessage?:string,
}
