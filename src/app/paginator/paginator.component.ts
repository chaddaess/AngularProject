import {Component, inject, Input} from '@angular/core';
import {PaginatorService} from "./paginator.service";
import {Observable} from "rxjs";
import {AsyncPipe, NgClass} from "@angular/common";

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass
  ],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent {
  paginatorService=inject(PaginatorService)
  selectedPage$:Observable<number>
  @Input() visiblePages:number[]=[]
  @Input() totalPages:number=100;
  constructor() {
    this.selectedPage$=this.paginatorService.selectedPage$;
  }
   onClick(page:number){
    this.paginatorService.changePage(page);
   }
}
