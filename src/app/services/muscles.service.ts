import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Muscle} from "../models/muscle";
import {map, Observable} from "rxjs";
import {API} from "../../config/api.config";
import {MuscleResponse} from "../../MuscleResponse";

@Injectable({
  providedIn: 'root'
})
export class MusclesService {
  private http = inject(HttpClient);
  constructor() { }

   getMuscles(): Observable<Muscle[]> {
    return this.http.get<MuscleResponse>(API.muscle).pipe(
         map((response) => response.results)
       );
  }
   getMuscle(id: number): Observable<Muscle> {
    return this.http.get<Muscle>(API.muscle + "/" + id);
  }
}
