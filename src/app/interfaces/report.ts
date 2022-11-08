export interface Report {
    id: number;
    comany_name: string;
    company_id: number;
    created_at: Date;
    note?: string;
    reporter_first_name: string;
    reporter_id: number;
    reporter_last_name: string;
    type_fraud: number;
    type_harrassingTheApplicants: number;
    type_other: number;
    type_wrongOrMisleadingInformation: number;
    updated_at?: Date;
}