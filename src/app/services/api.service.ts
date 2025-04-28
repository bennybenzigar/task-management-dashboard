import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private cookieService: CookieService, private http: HttpClient) { }


  private baseUrl: string = 'https://jobs-1b0fd-default-rtdb.asia-southeast1.firebasedatabase.app';

  getuserDetails() {
    const user = this.cookieService.get('user')
    if (user) {
      return JSON.parse(user)
    }
    else {
      return
    }

  }

  getBaseUrl() {
    return this.baseUrl
  }

}
