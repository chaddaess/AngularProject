import { Injectable, inject } from '@angular/core';
import { API } from '../../config/api.config';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Exercise } from '../models/exercise.model';

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
  
  fetchExercises(page: number, itemsPerPage: number): Observable<Exercise[]> {
    const offset = (page - 1) * itemsPerPage;
    console.log('Fetching exercises for page', page);
    return this.http.get<any>(`${API.exercisebaseinfo}?limit=${itemsPerPage}&offset=${offset}`).pipe(
      map((response) => {
        return response.results.map((exercise: any) => {
          const exerciseData = exercise.exercises?.find((ex: { language: number }) => ex.language === 2);
          return {
            name: exerciseData?.name || 'No name available',
            description: this.parseDescription(exerciseData?.description || 'No description available'),
            image_url: exercise.images?.[0]?.image || '../../assets/default_exercise.avif',
            category: exercise.category?.name || 'N/A',
            muscles: exercise.muscles?.map((muscle: { name_en: string }) => muscle.name_en) || [],
            equipment: exercise.equipment?.map((eq: { name: string }) => eq.name) || ['No information available'],
          };
        });
      }),
    );
  }
  
  parseDescription(description: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(description, 'text/html');
    return doc.body.textContent || '';
  }
  
}
