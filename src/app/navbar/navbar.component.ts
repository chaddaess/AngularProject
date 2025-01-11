import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {UI_TEXTS} from "../Constants/Constants";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private router = inject(Router);
  constructor(...args: unknown[]);

  constructor() {}

  protected readonly UI_TEXTS = UI_TEXTS;
}
