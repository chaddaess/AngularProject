import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ExerciseService } from '../../services/exercise.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private exerciseService: ExerciseService, private router: Router) {}


  onSearch(query: string): void {
    if (query.trim()) {
      this.filteredExercises$ = this.exerciseService.searchExercises1(query);
    } else {
      this.filteredExercises$ = of([]); 
    }
  }
  onFocus() {
    this.filteredExercises$ = of([]); 
  }

  selectExercise(exercise: any): void {
    const id = exercise.id; 
    this.router.navigate(['/exercise', id]);
  }
}