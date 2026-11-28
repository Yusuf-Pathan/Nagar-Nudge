export interface Category {
  id: string;
  name: string;
  code: string;
  active: boolean;
  complaintCount?: number;
}

/** View model for category tiles (icon + color mapped from code). */
export interface CategoryItem {
  key: string;
  name: string;
  icon: string;
  colorClass: string;
}
