/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';

import { STORAGE_KEY } from './constants/config';
import { AuthService } from './services/auth.service';
import { EmployerService } from './services/employer.service';
import { SubjectService } from './services/subject.service';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(
    private employerService: EmployerService,
    private subjectService: SubjectService, private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    if (this.authService.isLogin()) {
      this.employerService.getListCompany().subscribe(() => { });
      this.subjectService.user.next(JSON.parse(localStorage.getItem(STORAGE_KEY.USER_INFO)));
    }
  }

}
