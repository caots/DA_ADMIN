import { Guest } from './guest'
import { Report } from './report'

export interface Employer extends Guest {
  full_name?: string;
  address_line?: string;
  asking_benefits?: string;
  asking_salary?: string;
  city_name: string;
  company_name: string;
  company_size_max: number;
  company_size_min: number;
  converge_customer_id?: number;
  created_at: Date;
  date_of_birth?: Date;
  description: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  nbr_credits?: string;
  note?: string;
  phone_number: string;
  profile_picture: string;
  provider: number;
  region_code?: string;
  reports: Array<Report>;
  sign_up_step: number;
  state_name: string;
  status: number;
  updated_at?: Date;
  verified_token?: string;
  is_deleted: number;
  chat_group_id: number;
  employer_info: any;
  employer_id: number;
  company_id: number;
  claimed_text: string;
  is_claimed: number;
}

export interface EmployerMember{
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  employerTitle: string;
  employerID: number;
  emailVerified: number;
  status: number;
  profilePicture: string;
  createAt: Date;
  updateAt: Date;
  isDeleted: number;
  isUserDeleted: number
  permission: any;
}
