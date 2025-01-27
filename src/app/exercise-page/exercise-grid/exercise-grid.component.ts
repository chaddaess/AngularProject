import { Component, Input, Signal, signal } from '@angular/core';
import { ExerciseCardComponent } from '../exercise-card/exercise-card.component';
import { Exercise } from '../../models/exercise.model';
import { LoadingComponent } from '../../loading/loading.component';

@Component({
  selector: 'app-exercise-grid',
  standalone: true,
  imports: [ExerciseCardComponent,LoadingComponent],
  templateUrl: './exercise-grid.component.html',
  styleUrl: './exercise-grid.component.css'
})
export class ExerciseGridComponent {
  @Input() exercises: Exercise[] = [];
  @Input() loading: Signal<number>=signal(1);
}
