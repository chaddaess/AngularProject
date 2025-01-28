import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../auth/auth.service";
import {catchError, map, Observable, of} from "rxjs";
import {API} from "../../config/api.config";
import {Exercise} from "../models/exercice";
import {ExerciseResponse} from "../../ExerciseResponse";

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  getExercises(): Observable<Exercise[]> {
    const httpHeaders = this.authService.getAuthHeaders();
    return this.http.get<ExerciseResponse>(API.exercise, {headers: httpHeaders}).pipe(map((response) => response.results));
  }

  getExercise(id: number): Observable<Exercise> {
    const httpHeaders = this.authService.getAuthHeaders();
    return this.http.get<Exercise>(`${API.exercise}/${id}`, {headers: httpHeaders});
  }

  searchExercises(keyword: string): Observable<Exercise[]> {
    return this.http.get<{
      suggestions: [{ data: Exercise }]
    }>(`${API.search_exercises}?language=english&term=${keyword}`).pipe(map((result) => {
      const exerciseObjects = result.suggestions;
      return exerciseObjects.map((exerciseObject) => {
        return exerciseObject.data;
      });
    }), catchError(() => {
      const exercise = {
        id: -1, name: '', errorMessage: "We're having trouble searching for exercises, please try again!"
      };
      return of([exercise]);
    }));
  }

}
