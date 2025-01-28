import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { ListComponent } from './list/list.component';
import { ExerciseService } from '../services/exercise.service';
import { BehaviorSubject, Observable, Subscription, finalize, map, of } from 'rxjs';
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
  /*private exercisesSubject: BehaviorSubject<Exercise[]> = new BehaviorSubject<Exercise[]>([]);*/
  /*exercises$: Observable<Exercise[]> = this.exercisesSubject.asObservable();*/

  private subscriptions: Subscription[] = [];
  private cache: Map<number, Exercise[]> = new Map();
  private pageOrder: number[] = [];  
  private cacheLimit: number = 5; 
  isLoading = signal(1);
  filteredExercises: Exercise[] = [];
  exercisesAreLoading = signal(1);
  selectedCategories: string[] = [];
  selectedMuscles: string[] = [];
  selectedEquipment: string[] = [];

  constructor(
    private exerciseService: ExerciseService,
    private route: ActivatedRoute, ) {}
    ngOnInit() {
      const savedState = localStorage.getItem('exercisePageState');
      const data = this.route.snapshot.data['data'];
      /*console.log('Data categories:', data.categories);
      console.log('Data muscles:', data.muscles);
      console.log('Data equipments:', data.equipments); */
      const dataProcessing = Promise.resolve().then(() => {
      this.exercisesList = data.exercises || [];
      this.categoriesList = this.mapSelectedItems(data.categories || []);
      this.musclesList = this.mapSelectedItems(data.muscles || []);
      this.equipmentsList = this.mapSelectedItems(data.equipments || []);
      this.filteredExercises = this.exercisesList;

      if (savedState) {
        const parsedState = JSON.parse(savedState);
        this.currentPage = parsedState.currentPage || 1;
        const cacheArray = parsedState.cache || [];
        this.cache = new Map<number, any>(cacheArray);
        this.selectedCategories = parsedState.filters?.categories || [];
        this.selectedMuscles = parsedState.filters?.muscles || [];
        this.selectedEquipment = parsedState.filters?.equipment || [];
        this.pageOrder = parsedState.pageOrder || [];
      } else {
        this.cache.set(1, this.exercisesList);
        this.pageOrder.push(1);
        
      } });
      dataProcessing.then(() => {
        this.isLoading.set(0);
        console.log("complete loading")
      });
      this.exercisesAreLoading.set(0);
      
       
    }
    
    mapSelectedItems(items: any[]): { name: string; selected: boolean }[] {
      return items.map(item => ({
        name: item.name || item, 
        selected: false
      }));
    }

ngOnDestroy(): void {
  this.subscriptions.forEach(sub => sub.unsubscribe());
  this.saveState();
}

loadPage(page: number) {
  if (this.cache.has(page)) {
    this.exercisesList = this.cache.get(page) || [];
    this.filterExercises();
    /*this.exercisesSubject.next(this.exercisesList);*/
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
    /*this.exercisesSubject.next(exercises);*/
    this.filterExercises();
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
  this.scrollToTop();
}

scrollToTop(): void {
  window.scrollTo(0, 0); // Scrolls to the top of the page

}
  
onItemToggle(itemName: string, type: string) {
  let item: any;
  switch (type) {
    case 'categories': {
      item = this.categoriesList.find((cat) => cat.name === itemName);
      if (item) {
        item.selected = !item.selected;
        this.toggleItem(itemName, this.selectedCategories);  // Passing name to selected list
      }
      break;
    }
    case 'equipments': {
      item = this.equipmentsList.find((eq) => eq.name === itemName);
      if (item) {
        item.selected = !item.selected;
        this.toggleItem(itemName, this.selectedEquipment);  // Passing name to selected list
      }
      break;
    }
    case 'muscles': {
      item = this.musclesList.find((musc) => musc.name === itemName);
      if (item) {
        item.selected = !item.selected;
        this.toggleItem(itemName, this.selectedMuscles);  // Passing name to selected list
      }
      break;
    }
  }

  this.filterExercises();
}

toggleItem(itemName: string, selectedList: string[]) {
  const index = selectedList.indexOf(itemName);  
  if (index === -1) {
    selectedList.push(itemName);  
  } else {
    selectedList.splice(index, 1);  
  }
}

  filterExercises() {
    let filtered = this.exercisesList; 
    if (this.selectedCategories.length) {
      filtered = filtered.filter(exercise => 
        this.selectedCategories.includes(exercise.category));
    }
    if (this.selectedMuscles.length) {
      filtered = filtered.filter(exercise => 
        this.selectedMuscles.every(muscle => exercise.muscles.includes(muscle))
      );
    }
    if (this.selectedEquipment.length ) {
      filtered = filtered.filter(exercise => 
        this.selectedEquipment.every(equipment => exercise.equipment.includes(equipment))
      );
    }

    this.filteredExercises=filtered
  }

  onCategoryChange(category: string) {
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories = this.selectedCategories.filter(m => m !== category);
    } else {
      this.selectedCategories.push(category);
    }
    this.filterExercises();
  }

  onMuscleChange(muscle: string) {
    if (this.selectedMuscles.includes(muscle)) {
      this.selectedMuscles = this.selectedMuscles.filter(m => m !== muscle);
    } else {
      this.selectedMuscles.push(muscle);
    }
    this.filterExercises();
  }

  onEquipmentChange(equipment: string) {
    if (this.selectedEquipment.includes(equipment)) {
      this.selectedEquipment = this.selectedEquipment.filter(e => e !== equipment);
    } else {
      this.selectedEquipment.push(equipment);
    }
    this.filterExercises();
  }

  saveState() {
    const state = {
      categories: this.categoriesList,
      muscles:this.musclesList,
      equipments: this.equipmentsList,
      filters: {
        selectedCategories: this.selectedCategories,
        selectedMuscles: this.selectedMuscles,
        selectedEquipment: this.selectedEquipment
      },
      currentPage: this.currentPage,
      cache: Array.from(this.cache.entries()), 
      pageOrder: this.pageOrder,
    };
    localStorage.setItem('exercisePageState', JSON.stringify(state));
  }
  
}
