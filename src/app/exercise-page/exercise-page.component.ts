import { Component } from '@angular/core';
import { ListComponent } from './list/list.component';
import { ExerciseService } from '../services/exercise.service';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ExerciseGridComponent } from './exercise-grid/exercise-grid.component';
import { ActivatedRoute } from '@angular/router';
import { SearchBarComponent } from './search-bar/search-bar.component';
import {Exercise} from '../models/exercise.model'

@Component({
  selector: 'app-exercise-page',
  standalone: true,
  imports: [ListComponent,CommonModule,ExerciseGridComponent,SearchBarComponent],
  templateUrl: './exercise-page.component.html',
  styleUrl:'./exercise-page.component.css'
})
export class ExercisePageComponent {
  currentPage: number = 1;
  totalPages: number = 10; 
  itemsPerPage: number = 12;
  categories$: Observable<string[]> = this.exerciseService.getCategories();
  equipments$: Observable<string[]> = this.exerciseService.getEquipments();
  muscles$: Observable<string[]> = this.exerciseService.getMuscles();
  categoriesList: { name: string; selected: boolean }[] = [];
  equipmentsList: { name: string; selected: boolean }[] = [];
  musclesList: { name: string; selected: boolean }[] = [];
  exercisesList: Exercise[] = [];
  private exercisesSubject: BehaviorSubject<Exercise[]> = new BehaviorSubject<Exercise[]>([]);
  exercises$: Observable<Exercise[]> = this.exercisesSubject.asObservable();

  private subscriptions: Subscription[] = [];
  private cache: Map<number, Exercise[]> = new Map();
  private pageOrder: number[] = [];  
  private cacheLimit: number = 5; 
  
  constructor(
    private exerciseService: ExerciseService,
    private route: ActivatedRoute) {}

ngOnInit() {
  this.fetchExercises(this.currentPage);
  this.subscriptions.push(
    this.categories$.subscribe(data => this.categoriesList = this.mapSelectedItems(data)),
    this.muscles$.subscribe(data => this.musclesList = this.mapSelectedItems(data)),
    this.equipments$.subscribe(data => this.equipmentsList = this.mapSelectedItems(data)),
    this.exercises$.subscribe(data => this.exercisesList = data)
  );
}
mapSelectedItems(items: string[]): { name: string; selected: boolean }[] {
  return items.map(item => ({ name: item, selected: false })); // Set 'selected' to false initially
}
ngOnDestroy(): void {
  this.subscriptions.forEach(sub => sub.unsubscribe());
}

loadPage(page: number) {
  if (this.cache.has(page)) {
    this.exercisesList = this.cache.get(page) || [];
    this.exercisesSubject.next(this.exercisesList);
    this.updatePageOrder(page);  
  } else {
    this.fetchExercises(page);
  }
}

fetchExercises(page: number) {
  const subs = this.exerciseService.fetchExercises(page, this.itemsPerPage).subscribe((exercises) => {
    if (this.cache.size >= this.cacheLimit) {
      this.removeLeastRecentlyUsedPage();  
    }
    this.cache.set(page, exercises);
    this.pageOrder.push(page); 
    this.exercisesList = exercises;
    this.exercisesSubject.next(exercises);
  });
  this.subscriptions.push(subs)
}

updatePageOrder(page: number) {
  const index = this.pageOrder.indexOf(page);
  if (index !== -1) {
    this.pageOrder.splice(index, 1);  
  }
  this.pageOrder.push(page);  
}

removeLeastRecentlyUsedPage() {
  const leastUsedPage = this.pageOrder.shift();  
  if (leastUsedPage !== undefined) {
    this.cache.delete(leastUsedPage);  
  }
}

changePage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.loadPage(page);
    console.log("cached pages: ", this.cache.keys())  
  }
}

  
  onItemToggle(itemName: string, itemList: { name: string, selected: boolean }[]) {
    const item = itemList.find((cat) => cat.name === itemName);
    if (item) {
      item.selected = !item.selected;
    }
  }
  
}
