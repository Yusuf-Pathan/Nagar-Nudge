export interface Category {
  id: string;
  name: string;
  code: string;
  active: boolean;
  complaintCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryRequest {
  name: string;
  code?: string;
  active?: boolean;
}
