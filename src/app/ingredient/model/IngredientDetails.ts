import {IngredientImage} from "./IngredientImage";
import {WeightUnits} from "./WeightUnits";

export class IngredientDetails{
  constructor(
    public id?: number,
    public uuid?: string,
    public remote_id?: string,
    public source_name?: string,
    public source_url?: string,
    public code?: string,
    public name?: string,
    public created?: Date,
    public last_update?: Date,
    public last_imported?: Date,
    public energy?: number,
    public protein?: string,
    public carbohydrates?: string,
    public carbohydrates_sugar?: string,
    public fat?: string,
    public fat_saturated?:string,
    public fiber?: string,
    public sodium?: string,
    public weight_units? :WeightUnits[],
    public language?: any,
    public image?:IngredientImage,
    //if an error occurs in a http request related to IngredientDetails
    //the service or component will set this to the appropriate message
    public errorMessage?:string,
  ) {}
}
