export type GetNutritionPlansResponse = {
  count: number
  next: string
  previous: string
  results: NutritionPlan[]
}

export class NutritionPlan  {
  constructor(
    public id?: number,
    public creation_data?: string,
    public description?: string,
    public only_logging?: boolean,
    public goal_energy?: number,
    public goal_protein?: number,
    public goal_carbohydrates?: number,
    public goal_fat?: number,
    public goal_fiber?: number,
    public error_message?:string,
  ) {}
}
