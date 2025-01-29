import {Component, EventEmitter, inject, Input, OnChanges, Output, signal } from '@angular/core';
import { PaginatorService } from '../../paginator/paginator.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { NutritionPlan } from '../models/getNutritionPlansResponse.model';
import { NutritionItemComponent } from "../nutrition-item/nutrition-item.component";
import { PaginatorComponent } from "../../paginator/paginator.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-nutrition-list',
  standalone: true,
  imports: [NutritionItemComponent, PaginatorComponent, RouterLink],
  templateUrl: './nutrition-list.component.html',
  styleUrl: './nutrition-list.component.css'
})
export class NutritionListComponent implements OnChanges {
    paginatorService = inject(PaginatorService)
    @Input() nutritionPlans: NutritionPlan[] | null = []
    @Output() pageChange = new EventEmitter<number>()
    @Input()  totalPages = 10
    visiblePages = signal<number[]>([]);
    constructor() {
      console.log(this.totalPages)
      this.paginatorService.selectedPage$.pipe(
        tap((page:number)=>{
            this.changeVisiblePages(page)
            this.pageChange.emit(page)
        }),
        takeUntilDestroyed(),
      ).subscribe()
    }

    ngOnChanges(): void {
        this.visiblePages.set(Array.from({ length: this.totalPages}, (_, i) => i + 1))
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
