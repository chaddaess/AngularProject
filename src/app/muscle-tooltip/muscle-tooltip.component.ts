import {Component, Input} from '@angular/core';
import {Muscle} from "../models/muscle";
import {API} from "../../config/api.config";

@Component({
  selector: 'app-muscle-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './muscle-tooltip.component.html',
  styleUrl: './muscle-tooltip.component.css'
})
export class MuscleTooltipComponent {
  @Input() muscle: Muscle | undefined;
  protected readonly API = API;
}
