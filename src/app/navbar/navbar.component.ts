import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NAVBAR_TEXTS} from "../Constants/Constants";
import {AuthService} from "../auth/auth.service";
import {APP_ROUTES} from "../../config/routes.config";

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

  protected readonly UI_TEXTS = NAVBAR_TEXTS;

  logout() {
    this.authService.logout();
    this.router.navigate([APP_ROUTES.login]);
  }

    protected readonly APP_ROUTES = APP_ROUTES;
}
