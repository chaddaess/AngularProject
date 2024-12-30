import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {BodyViewerComponent} from "./body-viewer/body-viewer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BodyViewerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
