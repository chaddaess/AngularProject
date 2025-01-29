export class ExerciseDto {
  constructor(public set: number = 0,
              public reps: number,
              public description: string = '',
              public weightUnit: number = 0,
              public weight: number,
              public  rir: number) {
  }
}
