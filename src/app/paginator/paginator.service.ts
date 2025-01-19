import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {
  #selectedPage=new BehaviorSubject<number>(1)
  selectedPage$=this.#selectedPage.asObservable()

  changePage(page:number){
    this.#selectedPage.next(page);
  }

  constructor() { }
}
