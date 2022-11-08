import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ACCOUNT_TYPE } from '../constants/config';
import { Report } from 'app/interfaces/report';
import { Employer, EmployerMember } from 'app/interfaces/employer'
import { environment } from '../../environments/environment';
import { SubjectService } from './subject.service';

@Injectable({
  providedIn: 'root'
})

export class EmployerService {
  constructor(
    private subjectService: SubjectService,
    private httpClient: HttpClient,
  ) { }

  uploadImage(file) {
    const url = `${environment.api_url}uploads`;
    return this.httpClient.post(url, file);
  }


  getListEmployer(params): Observable<{ listEmployer: Array<Employer>, total: number }> {
    const url = `${environment.api_url}admin/users?${new URLSearchParams(params).toString()}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return {
        total: data.total,
        listEmployer: data.results.map(item => this._mapEmployer(item))
      }
    }))
  }

  getListAccountingEmployer(params): Observable<{ listEmployer: Array<Employer>, total: number }> {
    const url = `${environment.api_url}admin/account?${new URLSearchParams(params).toString()}`;
    return this.httpClient.get(url).pipe(map((result: any) => {
      return {
        total: result.data.total,
        listEmployer: result.data.results.map(item => this._mapAccountingEmployer(item))
      }
    }))
  }

  getEmployerById(id: number): Observable<Employer> {
    const url = `${environment.api_url}admin/users/${id}`;
    return this.httpClient.get<Employer>(url);
  }

  getListCompany(orderNo = 0): Observable<any[]> {
    const url = `${environment.api_url}admin/company?orderNo=${orderNo}`;
    return this.httpClient.get(url).pipe(map((results: any[]) => {
      this.subjectService.companies.next(results);
      return results;
    }))
  }

  updateEmployer(id, employer) {
    const url = `${environment.api_url}admin/users/${id}`;
    return this.httpClient.put(url, employer);
  }

  changeStatusEmployer(id, status): Observable<Employer> {
    const url = `${environment.api_url}admin/users/${id}/active/${status}`;
    return this.httpClient.get<Employer>(url);
  }

  deletesEmployer(data, action) {
    const url = `${environment.api_url}admin/users`;
    return this.httpClient.request('delete', url, { body: { ids: JSON.stringify(data), action: action } })
  }

  async getTotalEmployer(isAccountingPage: boolean = false): Promise<Array<any>> {
    const result = [];
    const listStatus = ['active', 'inactive', 'flagged'];
    for (let i = 0; i < listStatus.length; i++) {
      result.push({
        id: listStatus[i],
        total: isAccountingPage ? await this.getTotalAccountingEmployerByStatus(listStatus[i]) : await this.getTotalEmployerByStatus(listStatus[i])
      })
    }

    return result;
  }

  async getTotalEmployerByStatus(type): Promise<number> {
    const query = {
      accType: ACCOUNT_TYPE.EMPLOYER,
      searchType: type
    }

    const res = await this.getListEmployer(query).toPromise();
    return res.total;
  }

  async getTotalAccountingEmployerByStatus(type): Promise<number> {
    const query = {
      accType: ACCOUNT_TYPE.EMPLOYER,
      searchType: type
    }

    const res = await this.getListAccountingEmployer(query).toPromise();
    return res.total;
  }

  private _mapEmployerReport(data): Report {
    return {
      id: data.id,
      comany_name: data.comany_name,
      company_id: data.company_id,
      created_at: data.created_at ? new Date(data.created_at) : null,
      note: data.note,
      reporter_first_name: data.reporter_first_name,
      reporter_id: data.reporter_id,
      reporter_last_name: data.reporter_last_name,
      type_fraud: data.type_fraud,
      type_harrassingTheApplicants: data.type_harrassingTheApplicants,
      type_other: data.type_other,
      type_wrongOrMisleadingInformation: data.type_wrongOrMisleadingInformation,
      updated_at: data.updated_at ? new Date(data.updated_at) : null,
    } as Report;
  }

  private _mapEmployer(data): Employer {
    return {
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
      chat_group_id: data.chat_group_id,
      employer_id: data.employer_id,
      company_id: data.company_id,
    } as Employer;
  }

  private _mapAccountingEmployer(data) {
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
