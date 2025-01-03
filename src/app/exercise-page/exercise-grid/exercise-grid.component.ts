import { Component, Input } from '@angular/core';
import { ExerciseCardComponent } from '../exercise-card/exercise-card.component';

@Component({
  selector: 'app-exercise-grid',
  standalone: true,
  imports: [ExerciseCardComponent],
  templateUrl: './exercise-grid.component.html',
  styleUrl: './exercise-grid.component.css'
})
export class ExerciseGridComponent {
  @Input() exercises: any; 
  ngOnInit(){
    console.log(this.exercises)
  }
}
