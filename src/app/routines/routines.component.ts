import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RoutineService } from '../services/routine.service';
import {Routine} from "../models/routine";
import {APP_ROUTES} from "../../config/routes.config";

@Component({
  selector: 'app-routine-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './routines.component.html'
})
export class RoutinesComponent implements OnInit {
  private routineService = inject(RoutineService);
  protected newRoutineLink = APP_ROUTES.createRoutine
  protected routines: Routine[] = [];
  protected selectedRoutine: Routine | null = null;
  protected loading = true;
  protected error: string | null = null;

  ngOnInit() {
    this.loadRoutines();
  }

  private loadRoutines() {
    this.loading = true;
    this.routineService.getRoutines().subscribe({
      next: (routines) => {
        console.log(routines);
        this.routines = routines;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load routines. Please try again later.';
        this.loading = false;
      }
    });
  }

  protected selectRoutine(routine: Routine) {
    this.selectedRoutine = this.selectedRoutine === routine ? null : routine;
  }

  protected deleteRoutine(event: Event, routineId: number) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this routine?')) {
      this.routineService.deleteRoutine(routineId).subscribe({
        next: () => {
          this.routines = this.routines.filter(r => r.id !== routineId);
        },
        error: (error) => {
          console.error('Error deleting routine:', error);
        }
      });
    }
  }
}
