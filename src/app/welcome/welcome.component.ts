import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {CONST} from "../../config/const.config";

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  username=JSON.parse(sessionStorage.getItem(CONST.currentUser)!).username
}
