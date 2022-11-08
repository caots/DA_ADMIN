import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { STATUS_CODE } from './constants/config';
import { MESSAGE } from './constants/message';
import { AuthService } from './services/auth.service';
import { HelperService } from './services/helper.service';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private helperService: HelperService,
    private authService: AuthService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(e => {
        const error = e.error.message || e.statusText;
        if (e.status === STATUS_CODE.UNAUTHRRIZED || error == MESSAGE.UNAUTHRRIZED) {
          this.authService.logout();
          this.router.navigate(['/auth/login']);
          this.helperService.showError(MESSAGE.ACCESS_DENIED);
        }
        
        return throwError(error);
      })
    )
  }
}