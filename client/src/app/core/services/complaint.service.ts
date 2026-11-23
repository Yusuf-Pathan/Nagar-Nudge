import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ApiEndpoint } from '../enums/api-endpoint.enum';
import { MOCK_RESOLVED_COMPLAINTS } from '../constants/mock-data.constants';
import { ApiResponse, Complaint, CreateComplaintRequest } from '../models';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  constructor(private http: HttpService) {}

  getResolvedComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(ApiEndpoint.RESOLVED_COMPLAINTS).pipe(
      map(res => res.data),
      catchError(() => of(MOCK_RESOLVED_COMPLAINTS))
    );
  }

  /** Sends the complaint and its media as multipart/form-data. */
  createComplaint(payload: CreateComplaintRequest): Observable<ApiResponse<Complaint>> {
    const body = new FormData();
    body.append('category', payload.category);
    body.append('title', payload.title);

    if (payload.description) {
      body.append('description', payload.description);
    }
    if (payload.location) {
      body.append('latitude', String(payload.location.latitude));
      body.append('longitude', String(payload.location.longitude));
    }
    payload.media.forEach(file => body.append('media', file, file.name));

    return this.http.post<Complaint, FormData>(ApiEndpoint.COMPLAINTS, body);
  }
}
