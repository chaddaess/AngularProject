import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Routine} from '../models/routine';
import {API} from "../../config/api.config";
import {AuthService} from "../auth/auth.service";
import {RoutineDto} from "../auth/dto/routine.dto";

@Injectable({
    providedIn: 'root'
})
export class RoutineService {
    private readonly http = inject(HttpClient);
    private readonly authService = inject(AuthService);

    createRoutine(routine: RoutineDto): Observable<Routine> {
        const httpHeaders = this.authService.getAuthHeaders();
        return this.http.post<Routine>(API.day, routine, {headers: httpHeaders});
    }

    getRoutines(): Observable<Routine[]> {
        const httpHeaders = this.authService.getAuthHeaders();
        return this.http.get<Routine[]>(API.day, {headers: httpHeaders});
    }

    getRoutine(id: string): Observable<Routine> {
        const httpHeaders = this.authService.getAuthHeaders();
        return this.http.get<Routine>(`${API.day}/${id}`, {headers: httpHeaders});
    }

    updateRoutine(id: string, routine: Partial<Routine>): Observable<Routine> {
        return this.http.patch<Routine>(`${API.day}/${id}`, routine);
    }

    deleteRoutine(id: string): Observable<void> {
        return this.http.delete<void>(`${API.day}/${id}`);
    }
}
