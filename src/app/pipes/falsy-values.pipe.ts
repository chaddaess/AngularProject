import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'falsyValues',
  standalone: true
})
export class FalsyValuesPipe implements PipeTransform {
  transform(value: number|string|undefined,unit:string): string {
    if(!value || typeof value==="string" && value.trim()===""){
      return "N.A."
    }
    if (typeof value === "number") {
      value = parseFloat(value.toFixed(2));
    }
    return `${value} ${unit}`;
  }

}
