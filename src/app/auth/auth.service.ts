import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, switchMap, tap, throwError} from "rxjs";
import {CredentialsDto} from "./dto/credentials.dto";
import {API} from "../../config/api.config";
import {User} from "./user";
import {CONST, UI_TEXTS} from "../../config/const.config";


@Injectable({
  providedIn: "root"
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private httpClient = inject(HttpClient)
  constructor() {
    const storedUser = sessionStorage.getItem(CONST.currentUser);
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    } }

  login(data: CredentialsDto) {
    return this.httpClient.post(API.getToken, data).pipe(
      tap((result: any) => {
        localStorage.setItem(CONST.accessToken, result['access']);
        console.log(JSON.stringify(result));
      }),
      switchMap(() => this.getUserProfile()),
    );
  }

  getUserProfile() {
    return this.httpClient.get<User>(API.userProfile).pipe(
      tap((user) => {
        sessionStorage.setItem(CONST.currentUser, JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout() {
    localStorage.removeItem(CONST.accessToken);
    sessionStorage.removeItem(CONST.currentUser);
    this.currentUserSubject.next(null);
  }

  isLoggedIn() {
    return !!localStorage.getItem(CONST.accessToken);
  }

  getAuthHeaders() {
    const access_token = localStorage.getItem(CONST.accessToken);
    return new HttpHeaders({
      'Authorization': `Bearer ${access_token}`
    });
  }
  updateUserSettings(data:Partial<User>){
    return this.httpClient.post(API.userProfile, data).pipe(
      switchMap(() => this.getUserProfile()),
      tap(() => {
        console.log('User settings updated successfully.');
      }),
      catchError((error) => {
        if (error.status === 400) {
          return throwError(() => new Error(UI_TEXTS.INVALID_DATA));
        } else if (error.status === 401) {
          return throwError(() => new Error(UI_TEXTS.UNAUTHORIZED));
        } else if (error.status === 500) {
          return throwError(() => new Error(UI_TEXTS.API_ERROR));
        }
        return throwError(() => new Error(UI_TEXTS.API_ERROR));
      })
    );

  }
}
