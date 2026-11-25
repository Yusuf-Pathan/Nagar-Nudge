import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiEndpoint } from '../enums/api-endpoint.enum';
import { ComplaintStatus } from '../enums/complaint-status.enum';
import { ApiResponse, AssignComplaintRequest, Complaint, DashboardData, PaginationMeta } from '../models';
import { HttpService } from './http.service';

export interface ComplaintListParams {
  status?: string;
  category?: string;
  search?: string;
  assigned?: string;
  page?: number;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  constructor(private http: HttpService) {}

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(ApiEndpoint.DASHBOARD).pipe(map((res) => res.data));
  }

  getAll(params: ComplaintListParams = {}): Observable<{ items: Complaint[]; meta: PaginationMeta | undefined }> {
    const query: Record<string, string> = {};
    if (params.status) query['status'] = params.status;
    if (params.category) query['category'] = params.category;
    if (params.search) query['search'] = params.search;
    if (params.assigned) query['assigned'] = params.assigned;
    if (params.page) query['page'] = String(params.page);
    if (params.limit) query['limit'] = String(params.limit);

    return this.http
      .get<Complaint[]>(ApiEndpoint.COMPLAINTS, '', query)
      .pipe(map((res) => ({ items: res.data ?? [], meta: res.meta })));
  }

  getById(id: string): Observable<Complaint> {
    return this.http.get<Complaint>(ApiEndpoint.COMPLAINTS, `/${id}`).pipe(map((res) => res.data));
  }

  getAssignableUsers(): Observable<{ id: string; name: string; email?: string | null }[]> {
    return this.http
      .get<{ id: string; name: string; email?: string | null }[]>(ApiEndpoint.ASSIGNABLE_USERS)
      .pipe(map((res) => res.data ?? []));
  }

  assign(id: string, assigneeId: string | null): Observable<ApiResponse<Complaint>> {
    const body: AssignComplaintRequest = { assigneeId };
    return this.http.patch<Complaint, AssignComplaintRequest>(ApiEndpoint.COMPLAINTS, body, `/${id}/assign`);
  }

  updateStatus(id: string, status: ComplaintStatus): Observable<ApiResponse<Complaint>> {
    return this.http.patch<Complaint, { status: ComplaintStatus }>(
      ApiEndpoint.COMPLAINTS,
      { status },
      `/${id}/status`
    );
  }
}
