export class WeightUnits {
  constructor(
    public gram: number,
    public amount: string,
    public unit: {
      "id": number,
      "full_name": string,
      "short_name": string,
      "url": string
    }
  ) {}
}
