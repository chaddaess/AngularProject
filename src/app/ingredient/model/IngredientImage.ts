export class IngredientImage{
  constructor(
      public id:number,
      public uuid:string,
      public ingredient_id:number,
      public ingredient_uuid:string,
      public image:string,
      public created:Date,
      public last_update:Date,
      public size:number,
      public width:number,
      public height:number,
      public license:number,
      public license_title:string,
      public license_object_url:string,
      public license_author: string,
      public license_author_url: string,
      public license_derivative_source_url:string,
  ) {}

}
