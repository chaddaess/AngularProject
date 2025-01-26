import {Component, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import {Ingredient} from "../model/Ingredient";
import {IngredientItemComponent} from "../ingredient-item/ingredient-item.component";
import {FormsModule} from "@angular/forms";
import {PaginatorComponent} from "../../paginator/paginator.component";
import {PaginatorService} from "../../paginator/paginator.service";
import {tap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-ingredient-list',
  standalone: true,
  imports: [
    IngredientItemComponent,
    FormsModule,
    PaginatorComponent
  ],
  templateUrl: './ingredient-list.component.html',
  styleUrl: './ingredient-list.component.css'
})
export class IngredientListComponent {
  paginatorService=inject(PaginatorService)
  @Input() ingredients:Ingredient[]|null=[]
  @Output() pageChange=new EventEmitter<number>()
  @Input()  totalPages=10
  visiblePages = signal<number[]>([]);
  constructor() {
    const initialNumberOfPages =Math.min(5,this.totalPages) ; //number of page choices on the paginator
    this.visiblePages.set(Array.from({ length: initialNumberOfPages}, (_, i) => i + 1))
    this.paginatorService.selectedPage$.pipe(
      tap((page:number)=>{
          this.changeVisiblePages(page)
          this.pageChange.emit(page)
      }),
      takeUntilDestroyed(),
    ).subscribe()
  }


  changeVisiblePages(currentPage: number): void {
    if (currentPage === this.visiblePages()[this.visiblePages().length - 1] && currentPage < this.totalPages) {
      this.visiblePages().shift();
      this.visiblePages().push(currentPage + 1);
    }
    if(currentPage==this.visiblePages()[0] && currentPage-1>=1){
        this.visiblePages().unshift(currentPage-1);
        this.visiblePages().pop();
    }
  }

}
