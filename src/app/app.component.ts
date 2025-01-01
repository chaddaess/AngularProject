import { Component } from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet} from '@angular/router';
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatProgressBar],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLoading = false;
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isLoading = false;
      }
    });
  }
}
