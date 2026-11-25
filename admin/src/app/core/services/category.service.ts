import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiEndpoint } from '../enums/api-endpoint.enum';
import { ApiResponse, Category, CategoryRequest, PaginationMeta } from '../models';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpService) {}

  list(params: { active?: string; page?: number; limit?: number } = {}): Observable<{ items: Category[]; meta: PaginationMeta | undefined }> {
    const query: Record<string, string> = {};
    if (params.active) query['active'] = params.active;
    if (params.page) query['page'] = String(params.page);
    if (params.limit) query['limit'] = String(params.limit);

    return this.http
      .get<Category[]>(ApiEndpoint.CATEGORIES, '', query)
      .pipe(map((res) => ({ items: res.data ?? [], meta: res.meta })));
  }

  create(body: CategoryRequest): Observable<ApiResponse<Category>> {
    return this.http.post<Category, CategoryRequest>(ApiEndpoint.CATEGORIES, body);
  }

  update(id: string, body: Partial<CategoryRequest>): Observable<ApiResponse<Category>> {
    return this.http.patch<Category, Partial<CategoryRequest>>(ApiEndpoint.CATEGORIES, body, `/${id}`);
  }

  remove(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<null>(ApiEndpoint.CATEGORIES, `/${id}`);
  }
}
