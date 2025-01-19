import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, switchMap, tap} from "rxjs";
import {CredentialsDto} from "./dto/credentials.dto";
import {API} from "../../config/api.config";
import {User} from "./user";
import {CONST} from "../../config/const.config";


@Injectable({
  providedIn: "root"
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

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
    const headers = this.getAuthHeaders();

    return this.httpClient.get<User>(API.userProfile, {headers}).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
        console.log(user);
      })
    );
  }

  logout() {
    localStorage.removeItem(CONST.accessToken);
    this.currentUserSubject.next(null);
  }

  isLoggedIn() {
    return !!localStorage.getItem(CONST.accessToken);
  }

  private getAuthHeaders() {
    const access_token = localStorage.getItem(CONST.accessToken);
    return new HttpHeaders({
      'Authorization': `Bearer ${access_token}`
    });
  }
}
