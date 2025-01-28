export enum DayOfWeek {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 7
}

export class RoutineDto {
  constructor(
    public description: string = '',
    public day: DayOfWeek[],
    public training: number,
  ) {}
}
