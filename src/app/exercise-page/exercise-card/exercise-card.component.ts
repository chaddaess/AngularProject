import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exercise-card',
  standalone: true,
  imports: [],
  templateUrl: './exercise-card.component.html',
  styleUrl: './exercise-card.component.css'
})
export class ExerciseCardComponent {
  @Input() exercise: any
  constructor(private router: Router){}
  selectExercise(exercise: any): void {
    const id = exercise.id; 
    this.router.navigate(['/exercise', id]);
  }

}
