import { Component } from '@angular/core';
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-loader-page',
  standalone: true,
  imports: [
    MatProgressBar,
    NgOptimizedImage
  ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {

}
