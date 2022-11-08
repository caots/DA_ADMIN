import { Assesment } from './assesment';

export interface JobPostings {
    fullname: string;
    city_name: string;
    employer_company_name: string;
    employer_first_name: string;
    employer_last_name: string;
    id: number;
    state_name: string;
    status: number;
    statusMess: string;
    title: string;
    created_at: Date;
    desciption: string;
    employer_company_size_max: number;
    employer_company_size_min: number;
    employer_description: string;
    employer_email: string;
    employer_id: number;
    employer_profile_picture: string;
    expired_at: Date;
    expired_days: number;
    job_assessments: Array<Assesment>;
    job_levels_name?: string;
    jobs_category_ids: number;
    jobs_category_name: string;
    jobs_level_id?: number;
    nbr_open: number;
    paid_at: Date
    qualifications?: string;
    salary: number;
    updated_at?: Date;
    is_deleted: number;
    bonus?: any;
    schedule_job?: any;
    benefits?: any;
    is_make_featured: number,
    is_private: number,
    add_urgent_hiring_badge: number,
    urlSeo: any,
    job_fall_under: any,
    salary_type: any,
    percent_travel: any,
    specific_percent_travel: any,
    is_specific_percent_travel: any,
    proposed_conpensation: any,
    employment_type: any,
    salary_min: any,
    salary_max: any,
    crawl_from: string;
    crawl_url: string;
    is_exclude_company: number;
    is_crawl_text_status: any;
    company_profile_picture: string;
    specific_percent_travel_type: number;
    statusCheckTemplate?: boolean
}

export class CitiWithLatLon {
    name: string; // city, state
    loc: number[];
  }