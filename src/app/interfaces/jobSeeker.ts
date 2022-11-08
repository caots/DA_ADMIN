import { Guest } from './guest'

export interface JobSeeker extends Guest{
    fullname: string;
    acc_type: number;
    address_line: string;
    asking_benefits?: string;
    asking_salary?: string;
    city_name?: string;
    company_name?: string;
    company_size_max?: number;
    company_size_min?: number;
    converge_customer_id?: number;
    created_at: Date;
    date_of_birth?: Date;
    description?: string;
    email: string;
    first_name: string;
    id: number;
    last_name: string;
    nbr_credits?: string;
    note?: string;
    phone_number?: string;
    profile_picture: string;
    provider: number;
    region_code?: string;
    sign_up_step: number;
    state_name?: string;
    status: number;
    updated_at: Date;
    verified_token?: string;
    is_deleted: number;
    chat_group_id: number;
}
