import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Routine} from '../models/routine';
import {API} from "../../config/api.config";

@Injectable({
  providedIn: 'root'
})
export class RoutineService {
  private readonly http = inject(HttpClient);

  createRoutine(routine: Partial<Routine>): Observable<Routine> {
    return this.http.post<Routine>(API.day, routine);
  }

  getRoutines(): Observable<Routine[]> {
    return this.http.get<Routine[]>(API.day);
  }

  getRoutine(id: string): Observable<Routine> {
    return this.http.get<Routine>(`${API.day}/${id}`);
  }

  updateRoutine(id: string, routine: Partial<Routine>): Observable<Routine> {
    return this.http.patch<Routine>(`${API.day}/${id}`, routine);
  }

  deleteRoutine(id: string): Observable<void> {
    return this.http.delete<void>(`${API.day}/${id}`);
  }
}
