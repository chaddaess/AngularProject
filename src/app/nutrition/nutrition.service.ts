import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, Subject } from 'rxjs';
import { API } from '../../config/api.config';
import { AuthService } from '../auth/auth.service';
import { GetNutritionPlansResponse, NutritionPlan } from './models/getNutritionPlansResponse.model';
import { Settings } from '../Settings';

@Injectable({
  providedIn: 'root'
})
export class NutritionService {
  http = inject(HttpClient)
  #selectednutritionPlan = new Subject<NutritionPlan>()
  selectednutritionPlan$ = this.#selectednutritionPlan.asObservable()

  constructor(private authService: AuthService) { }

  getNutritionPlans(settings: Settings): Observable<GetNutritionPlansResponse> {
    const {limit, offset} = settings;
    const requestHeaders = this.authService.getAuthHeaders();
    return this.http.get<GetNutritionPlansResponse>(`${API.nutritionPlan}?limit=${limit}&offset=${offset}`, {
      headers: requestHeaders
    }).pipe(
      map((result) => {
        return result;
      }),
      catchError(() => {
        return of({
          count: 0,
          next: "",
          previous: "",
          results: []
        });
      }),
    );
  }

  addNutritionPlan(requestBody: any): Observable<boolean> {
    const requestHeaders = this.authService.getAuthHeaders();
    return this.http.post(`${API.nutritionPlan}`, requestBody, {
      headers: requestHeaders,
    }).pipe(
      map((result) => {
        if(!result)
          return false;

        return true
      }),
      catchError(()=>{
        return of(false)
      })
    )
  }

  selectNutritionPlan(nutritionPlan: NutritionPlan):void {
    this.#selectednutritionPlan.next(nutritionPlan)
  }
}
