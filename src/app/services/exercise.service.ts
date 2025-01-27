import { Injectable, inject } from '@angular/core';
import { API } from '../../config/api.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, debounceTime, map, of, switchMap } from 'rxjs';
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
            id:exercise.id,
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

    searchExercises(query: string): Observable<any[]> {
      if (!query.trim()) {
        return of([]); }

      const params = new HttpParams()
      .set('language', 'en')
      .set('term', query);
    
      return this.http.get<any[]>(`${API.exerciseSearch}`, { params }).pipe(
        debounceTime(500), 
        switchMap((response:any) => {
          console.log('filtered names', response.suggestions); 
          return of(response.suggestions.map((item: any) => ({
            value: item.value,
            id: item.data.id, 
          })));
    }),
    catchError((error) => {
      console.error('Error fetching exercises:', error);
      return of([]); 
    })
  );
    }

    getExerciseById(id: number): Observable<any> {
      return this.http.get<any>(`${API.exercisebaseinfo}/${id}`).pipe(
        map((response) => {
          return {
            id: response.id,
            name: response.exercises?.[1]?.name || 'N/A',
            category: response.category?.name || 'N/A',
            muscles: response.muscles.map((muscle: any) => muscle.name).join(', ') || 'None',
            secondaryMuscles: response.muscles_secondary.map((muscle: any) => muscle.name).join(', ') || 'None',
            equipment: response.equipment.map((item: any) => item.name).join(', ') || 'None',
            description:this.parseDescription (response.exercises?.[1]?.description || 'No description available'),
            images: (response.images && response.images.length > 0) 
            ? response.images.map((image: any) => image.image) 
            : ['../../assets/default_exercise.avif'],            
            variations: response.variations || [],
          };
        }),
      );
    }
    
  }
  

