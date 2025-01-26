import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BodyViewerComponent} from "./body-viewer/body-viewer.component";
import {RoutineFormComponent} from "./routine-form/routine-form.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BodyViewerComponent, RoutineFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
