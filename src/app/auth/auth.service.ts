import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs";
import {CredentialsDto} from "./dto/credentials.dto";
import {API} from "../../config/api.config";
@Injectable({
  providedIn:"root"
})
export class AuthService {

  constructor(  private httpClient: HttpClient
) { }

  login(data: CredentialsDto) {
    return this.httpClient.post(API.login, data)
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
