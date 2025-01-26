import {Exercise} from "./exercice";

export enum DayOfWeek {Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday};

export class Routine {
  constructor(
    public id: number = 0,
    public training: number = 0,
    public name: string = '',
    public description: string = '',
    public scheduledDays: DayOfWeek[],
    public createdAt: Date,
    public updatedAt: Date,
    public isPublic: boolean,
    public exercises: Exercise[]
  ) {}
}
