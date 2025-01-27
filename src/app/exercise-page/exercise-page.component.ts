import { Component, signal } from '@angular/core';
import { ListComponent } from './list/list.component';
import { ExerciseService } from '../services/exercise.service';
import { BehaviorSubject, Observable, Subscription, finalize, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ExerciseGridComponent } from './exercise-grid/exercise-grid.component';
import { ActivatedRoute } from '@angular/router';
import { SearchBarComponent } from './search-bar/search-bar.component';
import {Exercise} from '../models/exercise.model'
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-exercise-page',
  standalone: true,
  imports: [ListComponent,CommonModule,ExerciseGridComponent,SearchBarComponent,LoadingComponent],
  templateUrl: './exercise-page.component.html',
  styleUrl:'./exercise-page.component.css'
})
export class ExercisePageComponent {
  currentPage: number = 1;
  totalPages: number = 10; 
  itemsPerPage: number = 12;
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
  isLoading = signal(1);
  exercisesAreLoading = signal(1);
  constructor(
    private exerciseService: ExerciseService,
    private route: ActivatedRoute) {}

    ngOnInit() {
      const data = this.route.snapshot.data['data'];
      this.exercisesList = data.exercises;
      this.exercisesSubject.next(this.exercisesList);
      this.categoriesList = this.mapSelectedItems(data.categories);
      this.musclesList = this.mapSelectedItems(data.muscles);
      this.equipmentsList = this.mapSelectedItems(data.equipments);
      this.isLoading.set(0); //need to fix this, executed before asynch code
      this.exercisesAreLoading.set(0);
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
    this.exercisesAreLoading.set(0); 
  } else {
    this.fetchExercises(page);
  }
}

fetchExercises(page: number) {
  const subs = this.exerciseService.fetchExercises(page, this.itemsPerPage).pipe(
    finalize(() => {
      this.exercisesAreLoading.set(0);
    })).subscribe((exercises) => {
    if (this.cache.size >= this.cacheLimit) {
      this.removeLeastRecentlyUsedPage();  
    }
    this.cache.set(page, exercises);
    this.pageOrder.push(page); 
    this.exercisesList = exercises;
    this.exercisesSubject.next(exercises);
  });
  this.subscriptions.push(subs);
  
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
  this.exercisesAreLoading.set(1);
  console.log("isloading",this.isLoading());
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.loadPage(page);
    console.log("cached pages: ", this.cache.keys())  
  };
  console.log("isloading",this.isLoading());

}
  
  onItemToggle(itemName: string, itemList: { name: string, selected: boolean }[]) {
    const item = itemList.find((cat) => cat.name === itemName);
    if (item) {
      item.selected = !item.selected;
    }
  }
  
}
