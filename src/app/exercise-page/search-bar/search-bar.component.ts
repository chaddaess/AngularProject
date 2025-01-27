import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, catchError, Observable, of } from 'rxjs';
import { ExerciseService } from '../../services/exercise.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule,CommonModule,AsyncPipe],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  searchQuery: string = '';
  filteredExercises$: Observable<any[]> = of([]); 

  @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private exerciseService: ExerciseService) {}


    onSearch(query: string): void {
    if (query.trim()) {
      this.filteredExercises$ = this.exerciseService.searchExercises(query);
    } else {
      this.filteredExercises$ = of([]); 
    }
  }
  onFocus() {
    this.filteredExercises$ = of([]); 
  }

  selectExercise(exercise: any): void {
    this.searchQuery = exercise.name; 
    this.filteredExercises$ = of([]); 
  }
}