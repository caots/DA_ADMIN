import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ACCOUNT_TYPE } from '../constants/config';
import { JobSeeker } from './../interfaces/jobSeeker'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class JobSeekerService {
  constructor(
    private httpClient: HttpClient
  ) { }

  getListJobSeeker(params): Observable<{ listJobseeker: Array<JobSeeker>, total: number }> {
    const url = `${environment.api_url}admin/users?${new URLSearchParams(params).toString()}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return {
        total: data.total,
        listJobseeker: data.results.map(item => this._mapJobseeker(item))
      }
    }))
  }

  getJobSeekerById(id: number): Observable<JobSeeker> {
    const url = `${environment.api_url}admin/users/${id}`;
    return this.httpClient.get<JobSeeker>(url);
  }

  updateJobSeeker(id, jobseeker) {
    const url = `${environment.api_url}admin/users/${id}`;
    return this.httpClient.put(url, jobseeker);
  }

  changeStatusJobseeker(id, status): Observable<JobSeeker> {
    const url = `${environment.api_url}admin/users/${id}/active/${status}`;
    return this.httpClient.get<JobSeeker>(url);
  }

  deletesJobseeker(data, action) {
    const url = `${environment.api_url}admin/users`;
    return this.httpClient.request('delete', url, { body: { ids: JSON.stringify(data), action: action } })
  }

  async getTotalJobseeker(isAccountingPage: boolean = false): Promise<Array<any>> {
    const result = [];
    const listStatus = ['active', 'inactive', 'flagged'];
    for (let i = 0; i < listStatus.length; i++) {
      result.push({
        id: listStatus[i],
        total: isAccountingPage ? await this.getTotalAccountingJobseekerByStatus(listStatus[i]) : await this.getTotalJobseekerByStatus(listStatus[i])
      })
    }

    return result;
  }

  async getTotalJobseekerByStatus(type): Promise<number> {
    const query = {
      accType: ACCOUNT_TYPE.JOB_SEEKER,
      searchType: type
    }

    const res = await this.getListJobSeeker(query).toPromise();
    return res.total;
  }

  async getTotalAccountingJobseekerByStatus(type): Promise<number> {
    const query = {
      accType: ACCOUNT_TYPE.JOB_SEEKER,
      searchType: type
    }

    const res = await this.getListAccountingJobSeeker(query).toPromise();
    return res.total;
  }


  getListAccountingJobSeeker(params): Observable<{ listJobseeker: Array<JobSeeker>, total: number }> {
    const url = `${environment.api_url}admin/account?${new URLSearchParams(params).toString()}`;
    return this.httpClient.get(url).pipe(map((result: any) => {
      return {
        total: result.data.total,
        listJobseeker: result.data.results.map(item => this._mapAccountingJobseeker(item))
      }
    }))
  }


  private _mapJobseeker(data): JobSeeker {
    return {
      fullname: `${data.first_name ? data.first_name : ''} ${data.last_name ? data.last_name : ''}`,
      acc_type: data.acc_type,
      address_line: data.address_line,
      asking_benefits: data.asking_benefits,
      asking_salary: data.asking_salary,
      city_name: data.city_name,
      company_name: data.company_name,
      company_size_max: data.company_size_max,
      company_size_min: data.company_size_min,
      converge_customer_id: data.converge_customer_id,
      created_at: data.created_at ? new Date(data.created_at) : null,
      date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : null,
      description: data.description,
      email: data.email,
      first_name: data.first_name,
      id: data.id,
      last_name: data.last_name,
      nbr_credits: data.nbr_credits,
      note: data.note,
      phone_number: data.phone_number,
      profile_picture: `${environment.api_url_short}${data.profile_picture}`,
      provider: data.provider,
      region_code: data.region_code,
      sign_up_step: data.sign_up_step,
      state_name: data.state_name,
      status: data.status,
      updated_at: data.updated_at ? new Date(data.updated_at) : null,
      verified_token: data.verified_token,
      is_deleted: data.is_deleted,
      chat_group_id: data.chat_group_id
    } as JobSeeker;
  }

  private _mapAccountingJobseeker(data) {
    return {
      id: data.id,
      acc_type: data.acc_type,
      email: data.email,
      provider: data.provider,
      date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : null,
      status:  data.status,
      fullname: `${data.first_name ? data.first_name : ''} ${data.last_name ? data.last_name : ''}`,
      company_name: data.company_name,
      phone_number: data.phone_number,
      address_line: data.address_line,
      note: data.note,
      asking_benefits: data.asking_benefits,
      description: data.description,
      created_at: data.created_at ? new Date(data.created_at) : null,
      updated_at: data.updated_at ? new Date(data.updated_at) : null,
      region_code: data.region_code,
      city_name: data.city_name,
      state_name: data.state_name,
      is_deleted: data.is_deleted,
      employer_id: data.employer_id,
      chat_group_id: data.chat_group_id,
    }
  }
}
