import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExercisePageComponent } from './exercise-page/exercise-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ExercisePageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
