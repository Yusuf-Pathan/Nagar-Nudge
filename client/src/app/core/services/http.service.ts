import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { API_BASE_URL } from '../constants/app.constants';
import { ApiEndpoint } from '../enums/api-endpoint.enum';
import { ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class HttpService {
  constructor(private http: HttpClient) {}

  get<T>(endpoint: ApiEndpoint, path = '', params?: Record<string, string>): Observable<ApiResponse<T>> {
    return this.http
      .get<ApiResponse<T>>(this.buildUrl(endpoint, path), { params })
      .pipe(catchError(this.handleError));
  }

  post<T, B>(endpoint: ApiEndpoint, body: B, path = ''): Observable<ApiResponse<T>> {
    return this.http
      .post<ApiResponse<T>>(this.buildUrl(endpoint, path), body)
      .pipe(catchError(this.handleError));
  }

  put<T, B>(endpoint: ApiEndpoint, body: B, path = ''): Observable<ApiResponse<T>> {
    return this.http
      .put<ApiResponse<T>>(this.buildUrl(endpoint, path), body)
      .pipe(catchError(this.handleError));
  }

  delete<T>(endpoint: ApiEndpoint, path = ''): Observable<ApiResponse<T>> {
    return this.http
      .delete<ApiResponse<T>>(this.buildUrl(endpoint, path))
      .pipe(catchError(this.handleError));
  }

  private buildUrl(endpoint: ApiEndpoint, path: string): string {
    return `${API_BASE_URL}${endpoint}${path}`;
  }

  private handleError = (error: HttpErrorResponse) => {
    const message = error.error?.message || error.message || 'Something went wrong';
    return throwError(() => new Error(message));
  };
}
