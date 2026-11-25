import { Complaint } from './complaint.model';

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

export interface TrendPoint {
  month: string;
  label: string;
  total: number;
  resolved: number;
}

export interface DashboardData {
  stats: DashboardStats;
  trend: TrendPoint[];
  recent: Complaint[];
}
