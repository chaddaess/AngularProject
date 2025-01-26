import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../auth/auth.service";
import {APP_ROUTES} from "../../config/routes.config";
import {UI_TEXTS} from "../../config/const.config";

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
  constructor(public authService:AuthService) {}

  protected readonly UI_TEXTS = UI_TEXTS;

  logout() {
    this.authService.logout();
    this.router.navigate([APP_ROUTES.login]);
  }

    protected readonly APP_ROUTES = APP_ROUTES;
}
