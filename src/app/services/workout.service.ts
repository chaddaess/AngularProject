import {inject, Injectable} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {HttpClient} from "@angular/common/http";
import {WorkoutDto} from '../auth/dto/workout.dto';
import {Observable, of, switchMap} from "rxjs";
import {API} from '../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  createWorkout(workout: Partial<WorkoutDto>): Observable<WorkoutDto> {
    const httpHeaders = this.authService.getAuthHeaders();
    return this.http.post<WorkoutDto>(API.workout, workout, {headers: httpHeaders});
  }

  getWorkouts(): Observable<WorkoutDto[]> {
    const httpHeaders = this.authService.getAuthHeaders();
    return this.http.get<WorkoutDto[]>(API.workout, {headers: httpHeaders});
  }

  getDefaultWorkout(): Observable<WorkoutDto> {
    const httpHeaders = this.authService.getAuthHeaders();

    return this.http.get<WorkoutDto[]>(API.workout, {headers: httpHeaders})
      .pipe(switchMap(workouts => {
        if (workouts && workouts.length > 0) {
          return of(workouts[0]);
        } else {
          const defaultWorkout: Partial<WorkoutDto> = {
            name: "default", description: "this is your first workout",
          };
          return this.createWorkout(defaultWorkout);
        }
      }));
  }
}
