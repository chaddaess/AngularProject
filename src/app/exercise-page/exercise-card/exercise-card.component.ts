import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-exercise-card',
  standalone: true,
  imports: [],
  templateUrl: './exercise-card.component.html',
  styleUrl: './exercise-card.component.css'
})
export class ExerciseCardComponent {
  @Input() exercise: any

}
