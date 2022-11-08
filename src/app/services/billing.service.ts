import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  constructor(
    private httpClient: HttpClient,
  ) { }


  switchSalary(string) {
    return string?.toString().indexOf(',') >= 0 ? string.replace(/\,/g,'') : string;
  }

  formatPrice(price){
    if(!price) return 0;
    if(typeof price === 'string') price = Number.parseInt(price);
    return Math.round((price + Number.EPSILON) * 100) / 100;
  }

}
