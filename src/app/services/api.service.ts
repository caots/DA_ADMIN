import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor(private httpClient: HttpClient) { }

  login(user) {
    const url = `${environment.api_url}admin/login`;
    return this.httpClient.post(url, user);
  }
  getAllCountry() {
    return this.httpClient.get<string[]>('./assets/data/counties.json');
  }
  getAllState() {
    return this.httpClient.get<string[]>('./assets/data/states.json');
  }
  getAllCompany(): Observable<Array<any>> {
    const url = `${environment.api_url}admin/jobs/companies`;
    return this.httpClient.get<Array<any>>(url);
  }
}