import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'falsyValues',
  standalone: true
})
export class FalsyValuesPipe implements PipeTransform {
  transform(value: unknown,unit:string): any {
    if(!value || value===""){
      return "N.A."
    }
    return `${value} ${unit}`;
  }

}
