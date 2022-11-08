import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { StorageService } from '../services/storage.service';
import { STORAGE_KEY } from '../constants/config';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(
    private router: Router,
    private storageService: StorageService,
    private httpClient: HttpClient,
  ) { }

  saveToken(token: string) {
    return this.storageService.set(STORAGE_KEY.ACCESS_TOKEN, token);
  }

  saveTokenRole(role: any) {
    return this.storageService.set(STORAGE_KEY.ADMIN_ROLE, role);
  }

  saveTokenPermission(permission: any) {
    return this.storageService.set(STORAGE_KEY.ADMIN_PERMISSION, permission);
  }

  getTokenPermission(): any {
    return this.storageService.get(STORAGE_KEY.ADMIN_PERMISSION);
  }

  getTokenRole(): any {
    return this.storageService.get(STORAGE_KEY.ADMIN_ROLE);
  }

  getToken(): string {
    return this.storageService.get(STORAGE_KEY.ACCESS_TOKEN);
  }

  isLogin(): boolean {
    const token = this.getToken();
    return token ? true : false;
  }

  saveUser(user) {
    return this.storageService.set(STORAGE_KEY.USER_INFO, user);
  }

  getUser() {
    return this.storageService.get(STORAGE_KEY.USER_INFO);
  }

  saveRole(role: number) {
    return this.storageService.set(STORAGE_KEY.ROLE, role);
  }

  getRole(): number {
    return this.storageService.get(STORAGE_KEY.ROLE);
  }


  logout(){
    // this.cookieService.deleteAll();
    localStorage.clear();
    this.router.navigate(['/auth/login'])
  }

  resetPassword(data) {
    const url = `${environment.api_url}admin/admin-users/setPassword`
    return this.httpClient.post(url, data)
  }

  forgotPassword(email) {
    const url = `${environment.api_url}admin/users/forgotPassword`
    return this.httpClient.post(url, email)
  }
}
