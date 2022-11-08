export interface Assesment {
  id: number;
  name: string;
  assessmentId: number;
  duration?: number;
  point?: number;
  categoryName?: string;
  categoryId?: number;
  description?: string;
  type?: number;
  status: string;
  questions: number;
  created_at: Date;
  updated_at?: Date;
  assessments_name: string;
  weight?: number;
  categories?: {
    category_id: number;
  }[]
}
