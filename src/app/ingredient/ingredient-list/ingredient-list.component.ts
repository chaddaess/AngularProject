import {Component, inject, Input, signal} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {Ingredient} from "../model/Ingredient";
import {IngredientItemComponent} from "../ingredient-item/ingredient-item.component";
import {NgxPaginationModule} from "ngx-pagination";
import {FormsModule} from "@angular/forms";
import {PaginatorComponent} from "../../paginator/paginator.component";
import {PaginatorService} from "../../paginator/paginator.service";
import {tap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-ingredient-list',
  standalone: true,
  imports: [
    AsyncPipe,
    IngredientItemComponent,
    NgxPaginationModule,
    FormsModule,
    PaginatorComponent
  ],
  templateUrl: './ingredient-list.component.html',
  styleUrl: './ingredient-list.component.css'
})
export class IngredientListComponent {
  paginatorService=inject(PaginatorService)
  @Input() ingredients:Ingredient[]|null=[]
  currentPage: number = 1;
  totalPages:number=10; //TODO:change hardcoded value
  visiblePages=signal<number[]>([1,2,3,4,5])

  constructor() {
    this.paginatorService.selectedPage$.pipe(
      tap((page:number)=>{
          this.changeVisiblePages(page)
      }),
      takeUntilDestroyed(),
    ).subscribe()
  }

  onPageChange(event:any){
    //TODO: re-fetch ingredients from api
  }

  changeVisiblePages(page: number): void {
    if (page === this.visiblePages()[this.visiblePages().length - 1]) {
      const nextPage = page + 1;
      if (nextPage <= this.totalPages) {
        this.visiblePages().shift();
        this.visiblePages().push(nextPage);
      }
    }
    if(page==this.visiblePages()[0]){
      const prevPage=page-1;
      if(prevPage>=1){
        this.visiblePages().unshift(prevPage);
        this.visiblePages().pop();
      }
    }
  }

}
