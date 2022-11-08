import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';

import { environment } from '../../../environments/environment';

import { DirectivesModule } from '../../directives/directives.module';
import { LoginComponent } from './login.component';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    DirectivesModule,
    ReactiveFormsModule,
    RecaptchaV3Module,
    RouterModule.forChild([{ path: '', component: LoginComponent }])

  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.reCaptchaV3SiteKey
    }
  ],
})
export class LoginModule { }
