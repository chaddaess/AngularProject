import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {tap} from "rxjs";
import {LOGIN_URL} from "../Constants/Constants";
import {CredentialsDto} from "./dto/credentials.dto";
@Injectable({
  providedIn:"root"
})
export class AuthService {

  constructor(  private httpClient: HttpClient
) { }

  login(data: CredentialsDto) {
    return this.httpClient.post(LOGIN_URL, data)
      .pipe(tap((result) => {
        localStorage.setItem('authUser', JSON.stringify(result));
      }));
  }
  logout() {
    localStorage.removeItem('authUser');
  }
  isLoggedIn() {
    return localStorage.getItem('authUser')  ;
  }
}
