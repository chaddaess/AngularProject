import { Injectable, inject } from '@angular/core';
import { API } from '../../config/api.config';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<string[]> {
    return this.http.get<any>(`${API.category}`).pipe(
      map((response) => response.results.map((item: any) => item.name))
    );
  }
  getEquipments(): Observable<string[]> {
    return this.http.get<any>(`${API.equipment}`).pipe(
      map((response) => response.results.map((item: any) => item.name))
    );
  }
  getMuscles(): Observable<string[]> {
    return this.http.get<any>(`${API.muscle}`).pipe(
      map((response) => response.results.map((item: any) => item.name))
    );
  }
  getExercises(): Observable<string[]> {
    return this.http.get<any>(`${API.exercisebaseinfo}?limit=5`).pipe(
      map((response) =>{
        console.log(response.results);
        return response.results})
    );
  }
}
