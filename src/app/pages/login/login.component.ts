import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha';

import { ApiService } from '../../services/api.service';
import { HelperService } from '../../services/helper.service';
import { AuthService } from '../../services/auth.service';
import { SubjectService } from '../../services/subject.service';
import { UserInfo } from '../..//interfaces/userInfo';
import { ADMIN_PERMISSION, ADMIN_TYPE } from '../../constants/config';
import { EmployerService } from 'app/services/employer.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [FormBuilder]
})

export class LoginComponent implements OnInit {
  public formLogin: FormGroup;
  public captchaV3Code: string;
  public submitted: boolean = false;
  public messages: string[] = [];
  public isCallingApi: boolean = false;
  public emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
    private apiService: ApiService,
    private helperService: HelperService,
    private subjectService: SubjectService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private employerService: EmployerService,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.initForm();
    this.generateCaptchaV3();
  }

  initForm() {
    this.formLogin = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: ['']
    })
  }

  generateCaptchaV3() {
    this.recaptchaV3Service.execute('importantAction').subscribe(token => {
      this.captchaV3Code = token;
    })
  }

  login(form) {
    this.helperService.markFormGroupTouched(this.formLogin);
    if (this.formLogin.invalid) {
      return;
    }

    this.isCallingApi = true;
    this.apiService.login({
      'email': form.email,
      'password': form.password,
      'remember_me': form.rememberMe,
      'g-recaptcha-response': this.captchaV3Code
    }).subscribe((res: any) => {
      if (res.auth_info.access_token) {
        this.authService.saveToken(res.auth_info.access_token);
        this.authService.saveTokenRole(res.user_info.acc_type)
        if (res.user_info.acc_type != ADMIN_TYPE.SUPER_ADMIN) {
          console.log(res.user_info.permission)
          this.authService.saveTokenPermission(res.user_info.permission)
        }
        const userInfo = res.user_info;
        this.subjectService.user.next({
          id: userInfo.id,
          email: userInfo.email,
          firstName: userInfo.first_name,
          lastName: userInfo.last_name
        } as UserInfo);
        this.employerService.getListCompany().subscribe(() => { });
        this.authService.saveUser(userInfo);
        this.authService.saveRole(userInfo.role_id);
        if (res.user_info.acc_type == ADMIN_TYPE.SUPER_ADMIN) {
          this.router.navigate(['/pages/manage-employer']);
        }
      }
    }, resError => {
      this.isCallingApi = false;
      this.generateCaptchaV3();
      this.helperService.showError(resError);
    })
  }
}
