import {Component, inject} from '@angular/core';
import {Observable} from "rxjs";
import {Muscle} from "../model/muscle";
import {RoutinesService} from "../routines.service";
import {API} from "../../config/api.config";
import {AsyncPipe, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-muscles',
  standalone: true,
  imports: [
    AsyncPipe,
    NgOptimizedImage
  ],
  templateUrl: './muscles.component.html',
  styleUrl: './muscles.component.css'
})
export class MusclesComponent {
  muscles$: Observable<Muscle[]>;
  protected readonly API = API;
  private routinesService = inject(RoutinesService);

  constructor() {
    this.muscles$ = this.routinesService.getMuscles();
    console.log(this.muscles$);
  }
}
