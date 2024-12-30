import {Component, Input} from '@angular/core';
import {Muscle} from "../model/muscle";
import {API} from "../../config/api.config";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-muscle-tooltip',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './muscle-tooltip.component.html',
  styleUrl: './muscle-tooltip.component.css'
})
export class MuscleTooltipComponent {
  @Input() muscle: Muscle | undefined;
  protected readonly API = API;
}
