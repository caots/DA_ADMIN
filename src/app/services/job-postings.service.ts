import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { CitiWithLatLon, JobPostings } from 'app/interfaces/jobPostings';
import { Assesment } from 'app/interfaces/assesment';
import { JobCategory } from 'app/interfaces/jobCategory';
import { JobLevel } from 'app/interfaces/jobLevel';
import { HelperService } from './helper.service';


@Injectable({
  providedIn: 'root'
})
export class JobPostingsService {

  constructor(
    private httpClient: HttpClient,
    private helperService: HelperService
  ) { }

  getAllFallUnder() {
    return this.httpClient.get<string[]>('./assets/data/job-fall-under.json');
  }

  getAllState() {
    return this.httpClient.get<string[]>('./assets/data/states.json');
  }

  getAllCity() {
    return this.httpClient.get<any[]>('./assets/data/city.json');
  }

  getAllCitiesWithLatLon() {
    return this.httpClient.get<CitiWithLatLon[]>('./assets/data/cities-with-latlon.json');
  }

  getListJobPostings(params): Observable<{ listJobPostings: Array<JobPostings>, total: number }> {
    const url = `${environment.api_url}admin/jobs/list`;
    return this.httpClient.post(url, params).pipe(map((data: any) => {
      return {
        total: data.total,
        listJobPostings: data.results.map(item => this._mapListJobPostings(item))
      }
    }))
  }

  getParamsJobCrawl(): Observable<any> {
    const url = `${environment.api_url}admin/crawler/config`;
    return this.httpClient.get<any>(url);
  }

  getListJobCrawlings(params): Observable<{ listJob: Array<JobPostings>, total: number }> {
    const url = `${environment.api_url}admin/jobs/get-crawler`;
    return this.httpClient.post(url, params).pipe(map((data: any) => {
      return {
        total: data.total,
        listJob: data.results.map(item => this._mapListJobCrawl(item))
      }
    }))
  }

  getListCompanyCrawlingsPage(params): Observable<{ listData: Array<any[]>, total: number }> {
    const url = `${environment.api_url}admin/company/crawler/page?${new URLSearchParams(params).toString()}`;
    return this.httpClient.get(url, params).pipe(map((data: any) => {
      return {
        total: data.total,
        listData: data.results
      }
    }))
  }

  getListJobCrawlTemplate(params) {
    const url = `${environment.api_url}admin/jobs/crawl-template?${new URLSearchParams(params).toString()}`;
    return this.httpClient.get(url, params).pipe(map((data: any) => {
      return data;
    }))
  }

  getListCompanyCrawlings(params): Observable<any[]> {
    const url = `${environment.api_url}admin/company/crawler?${new URLSearchParams(params).toString()}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return data;
    }))
  }

  generateLinkPrivateJob(job: any){
    return `${environment.link_webapp}job/${job.urlSeo}`
  }

  getJobPostingsById(id: number): Observable<JobPostings> {
    const url = `${environment.api_url}admin/jobs/${id}`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return this._mapJobPostings(data);
    }))
  }

  getApplicantById(id: number) {
    const url = `${environment.api_url}admin/jobs/applicants/${id}`;
    return this.httpClient.get(url)
  }
  
  getAllCompanyCrawl(): Observable<any[]> {
    const url = `${environment.api_url}admin/company/crawler/list`;
    return this.httpClient.get(url).pipe(map((data: any) => {
      return data;
    }))
  }

  updateJobPostings(id, jobPosting) {
    const url = `${environment.api_url}admin/jobs/${id}`;
    return this.httpClient.put(url, jobPosting);
  }
  uploadFileJobCrawl(body) {
    const url = `${environment.api_url}admin/jobs/crawler`;
    return this.httpClient.post(url, body);
  }
  uploadFileConfigCrawl(body) {
    const url = `${environment.api_url}admin/crawler/config/upload`;
    return this.httpClient.post(url, body);
  }

  copyJobCrawlTemplate(body) {
    const url = `${environment.api_url}admin/jobs/crawl-template`;
    return this.httpClient.post(url, body);
  }
  
  updateParamsJobCrawl(id, data) {
    const url = `${environment.api_url}admin/crawler/config/${id}`;
    return this.httpClient.put(url, data);
  }

  activeJobCrawler(data) {
    const url = `${environment.api_url}admin/jobs/crawler/active`;
    return this.httpClient.put(url, data);
  }

  deletesJobPostings(data) {
    const url = `${environment.api_url}admin/jobs`;
    return this.httpClient.request('delete', url, { body: { ids: JSON.stringify(data) } })
  }

  updateTextShowCrawl(id, type) {
    const url = `${environment.api_url}admin/jobs/update-showtext/${id}/${type}`;
    return this.httpClient.get(url);
  }
  updateClaimedCompanyCrawl(params) {
    const url = `${environment.api_url}admin/company/crawler/claimed`;
    return this.httpClient.put(url, params);
  }

  deletesJobCrawlings(data) {
    const url = `${environment.api_url}admin/jobs/crawler`;
    return this.httpClient.request('delete', url, { body: { ids: JSON.stringify(data) } })
  }
  deletesCompanyCrawlings(id, type = '') {
    const url = `${environment.api_url}admin/company/crawler/${id}/${type}`;
    return this.httpClient.delete(url);
  }
  deletesConfigCrawlings(id) {
    const url = `${environment.api_url}admin/crawler/config/${id}`;
    return this.httpClient.delete(url);
  }
  newConfigCrawlings(index) {
    const url = `${environment.api_url}admin/crawler/config/duplicate/${index}`;
    return this.httpClient.get(url);
  }

  restoreJobPostings(data) {
    const url = `${environment.api_url}admin/jobs/restore`;
    return this.httpClient.request('put', url, { body: { ids: JSON.stringify(data) } })
  }

  getListJobLevel(): Observable<JobLevel[]> {
    const url = `${environment.api_url}jobs/levels`;
    return this.httpClient.get<JobLevel[]>(url);
  }

  getListCategory(): Observable<JobCategory[]> {
    const url = `${environment.api_url}jobs/categories`;
    return this.httpClient.get<JobCategory[]>(url);
  }

  getListAssessMent(): Observable<Assesment[]> {
    const url = `${environment.api_url}jobs/requiredAssessments/0`;
    return this.httpClient.get<Assesment[]>(url).pipe(map(listAssessment => {
      return listAssessment.map(assessment => {
        return this._mapAssessment(assessment);
      })
    }))
  }

  async getTotalJobPostings(): Promise<Array<any>> {
    const result = [];
    const listStatus = ['', 'expired', 'unpaid', 'deactive'];
    for (let i = 0; i < listStatus.length; i++) {
      result.push({
        id: listStatus[i],
        total: await this.getTotalJobPostingsByStatus(listStatus[i])
      })
    }

    return result;
  }

  async getTotalJobPostingsByStatus(type): Promise<number> {
    const query = {
      searchType: type
    }

    const res = await this.getListJobPostings(query).toPromise();
    return res.total;
  }


  getAllCountry() {
    return this.httpClient.get<string[]>('./assets/data/counties.json');
  }

  getAllJobCategory() {
    return this.httpClient.get<string[]>('./assets/data/job-category.json');
  }

  private _mapListJobPostings(data): JobPostings {
    return {
      fullname: `${data.employer_first_name ? data.employer_first_name : ''} ${data.employer_last_name ? data.employer_last_name : ''}`,
      city_name: data.city_name,
      employer_company_name: data.employer_company_name,
      employer_first_name: data.employer_first_name,
      employer_last_name: data.employer_last_name,
      id: data.id,
      state_name: data.state_name,
      status: data.status,
      title: data.title,
      is_deleted: data.is_deleted,
      is_make_featured: data.is_make_featured,
      is_private: data.is_private,
      add_urgent_hiring_badge: data.add_urgent_hiring_badge,
      expired_at: data.expired_at,
    } as JobPostings;
  }
  private _mapListJobCrawl(data): JobPostings {
    return {
      fullname: `${data.employer_first_name ? data.employer_first_name : ''} ${data.employer_last_name ? data.employer_last_name : ''}`,
      city_name: data.city_name,
      employer_company_name: data.employer_company_name,
      employer_first_name: data.employer_first_name,
      employer_last_name: data.employer_last_name,
      id: data.id,
      state_name: data.state_name,
      status: data.status,
      title: data.title,
      is_deleted: data.is_deleted,
      is_make_featured: data.is_make_featured,
      is_private: data.is_private,
      add_urgent_hiring_badge: data.add_urgent_hiring_badge,
      crawl_from: data.crawl_from,
      crawl_url: data.crawl_url,
      is_exclude_company: data.is_exclude_company,
      is_crawl_text_status: data.is_crawl_text_status
    } as JobPostings;
  }

  private _mapJobPostings(data): JobPostings {
    return {
      city_name: data.city_name,
      employer_company_name: data.employer_company_name,
      employer_first_name: data.employer_first_name,
      employer_last_name: data.employer_last_name,
      id: data.id,
      state_name: data.state_name,
      status: data.status,
      title: data.title,
      created_at: data.created_at ? new Date(data.created_at) : null,
      desciption: data.desciption,
      employer_company_size_max: data.employer_company_size_max,
      employer_company_size_min: data.employer_company_size_min,
      employer_description: data.employer_description,
      employer_email: data.employer_email,
      employer_id: data.employer_id,
      employer_profile_picture: data?.employer_profile_picture && data.employer_profile_picture.indexOf('http') >= 0 ? data.employer_profile_picture : `${environment.api_url_short}${data.employer_profile_picture}`,
      expired_at: data.expired_at ? new Date(data.expired_at) : null,
      expired_days: data.expired_days,
      job_assessments: data.job_assessments.map(assessment => this._mapAssessmentJob(assessment)),
      job_levels_name: data.job_levels_name,
      jobs_category_ids: data.jobs_category_ids,
      jobs_category_name: data.jobs_category_name,
      jobs_level_id: data.jobs_level_id,
      nbr_open: data.nbr_open,
      paid_at: data.paid_at ? new Date(data.paid_at) : null,
      qualifications: data.qualifications,
      salary: data.salary,
      is_deleted: data.is_deleted,
      updated_at: data.updated_at ? new Date(data.updated_at) : null,
      bonus: data.bonus,
      schedule_job: data.schedule_job,
      benefits: data.benefits,
      is_private: data.is_private,
      urlSeo: this.helperService.convertToSlugUrl(data.title, data.id),
      job_fall_under: data.job_fall_under,
      salary_type: data.salary_type,
      percent_travel: data.percent_travel,
      specific_percent_travel: data.specific_percent_travel,
      add_urgent_hiring_badge: data.add_urgent_hiring_badge,
      is_specific_percent_travel: data.is_specific_percent_travel,
      specific_percent_travel_type: data.specific_percent_travel_type == null ? "" : data.specific_percent_travel_type,
      proposed_conpensation: data.proposed_conpensation || 0,
      employment_type: data.employment_type,
      salary_min: data.salary_min,
      salary_max: data.salary_max,
    } as JobPostings;
  }

  private _mapAssessmentJob(data) {
    return {
      assessmentId: data.assessment_id,
      name: data.assessments_name,
      type: data.assessment_type,
      created_at: data.created_at ? new Date(data.created_at) : null,
      id: data.id,
      jobsId: data.jobs_id,
      point: data.point,
      status: data.status,
      updated_at: data.updated_at ? new Date(data.updated_at) : null,
    }
  }


  private _mapAssessment(data): Assesment {
    return {
      id: data.id,
      name: data.name,
      categoryId: data.category_id,
      categoryName: data.category_name,
      description: data.description,
      duration: data.duration,
      type: data.type,
      point: data.point,
      assessmentId: data.assessment_id,
      created_at: data.created_at ? new Date(data.created_at) : null,
      updated_at: data.updated_at ? new Date(data.updated_at) : null,
      status: data.status,
      categories: data.categories
    } as Assesment;
  }

}
