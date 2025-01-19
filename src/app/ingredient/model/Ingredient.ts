export class Ingredient{
  constructor(
    public id?:number,
    public name?:string,
    public image?:string,
    public category?:string,
    public image_thumbnail?:string,
    //if an error occurs in a http operation related to  an  Ingredient
    // the service or component will set this to the appropriate  message
    public errorMessage?:string,
  ) {}


}
