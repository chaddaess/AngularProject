export class Exercise {
    constructor(
      public name: string,
      public description: string,
      public image_url: string,
      public category: string,
      public muscles: string[],
      public equipment: string[]
    ) {}
}