import {IngredientImage} from "./IngredientImage";

export class IngredientDetails{
  constructor(
    public id: number,
    public uuid: string,
    public remote_id: string,
    public source_name: string,
    public source_url: string,
    public code: string,
    public name: string,
    public created: Date,
    public last_update: Date,
    public last_imported: Date,
    public energy: number,
    public protein: string,
    public carbohydrates: string,
    public carbohydrates_sugar: string,
    public fat: string,
    public fat_saturated:string,
    public fiber: string,
    public sodium: string,
    public weight_units : [
      {
        "gram": number,
        "amount": string,
        "unit": {
          "id": number,
          "full_name": string,
          "short_name": string,
          "url": string
        }
      }
    ],
    public language: any,
    public image:IngredientImage,
    public license:any,
    public license_title: string,
    public license_object_url: string,
    public license_author: string,
    public license_author_url: string,
    public license_derivative_source_url:string,
  ) {}
}
