import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { MOCK_COMPLAINTS } from '../constants/mock-data.constants';
import { ApiEndpoint } from '../enums/api-endpoint.enum';
import { ComplaintStatus } from '../enums/complaint-status.enum';
import { ApiResponse, Complaint, CreateComplaintRequest, ResolvedComplaint } from '../models';
import { HttpService } from './http.service';

const PLACEHOLDER_IMAGE = 'assets/images/placeholder.svg';

function toResolved(c: Complaint): ResolvedComplaint {
  const days = Math.floor((Date.now() - new Date(c.createdAt).getTime()) / 86_400_000);
  return {
    id: c.id,
    title: c.title,
    imageUrl: c.mediaUrls[0] ?? PLACEHOLDER_IMAGE,
    daysAgo: days
  };
}

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  constructor(private http: HttpService) {}

  getMyComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(ApiEndpoint.MY_COMPLAINTS).pipe(
      map(res => res.data),
      // TODO: remove this fallback once the API is live
      catchError(() => of(MOCK_COMPLAINTS))
    );
  }

  getResolvedComplaints(): Observable<ResolvedComplaint[]> {
    return this.http.get<Complaint[]>(ApiEndpoint.RESOLVED_COMPLAINTS).pipe(
      map(res => res.data.map(toResolved)),
      catchError(() =>
        of(MOCK_COMPLAINTS.filter(c => c.status === ComplaintStatus.RESOLVED).map(toResolved))
      )
    );
  }

  createComplaint(payload: CreateComplaintRequest): Observable<ApiResponse<Complaint>> {
    const body = new FormData();
    body.append('category', payload.category);
    body.append('title', payload.title);

    if (payload.description) {
      body.append('description', payload.description);
    }
    body.append('latitude', String(payload.location.latitude));
    body.append('longitude', String(payload.location.longitude));
    payload.media.forEach(file => body.append('media', file, file.name));

    return this.http.post<Complaint, FormData>(ApiEndpoint.COMPLAINTS, body);
  }
}
