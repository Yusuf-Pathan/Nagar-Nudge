import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { MOCK_COMPLAINTS } from '../constants/mock-data.constants';
import { ApiEndpoint } from '../enums/api-endpoint.enum';
import { ApiResponse, Complaint, CreateComplaintRequest, ResolvedComplaint, ResolvedComplaintDto } from '../models';
import { HttpService } from './http.service';

const MS_PER_DAY = 86_400_000;

function toViewModel(dto: ResolvedComplaintDto): ResolvedComplaint {
  const daysAgo = Math.max(0, Math.floor((Date.now() - new Date(dto.resolvedAt).getTime()) / MS_PER_DAY));
  return { ...dto, daysAgo };
}

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  constructor(private http: HttpService) {}

  /** The logged-in user's complaints, newest first. */
  getMyComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(ApiEndpoint.MY_COMPLAINTS).pipe(
      map(res => res.data),
      // TODO: remove this fallback once the API is live
      catchError(() => of(MOCK_COMPLAINTS))
    );
  }

  /** Public list of recently resolved complaints for the home page. */
  getResolvedComplaints(limit = 6): Observable<ResolvedComplaint[]> {
    return this.http
      .get<ResolvedComplaintDto[]>(ApiEndpoint.RESOLVED_COMPLAINTS, '', { limit: String(limit) })
      .pipe(
        map(res => res.data.map(toViewModel)),
        // The home page should still render if the API is down
        catchError(() => of([]))
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
    body.append('latitude', String(payload.location.latitude));
    body.append('longitude', String(payload.location.longitude));
    payload.media.forEach(file => body.append('media', file, file.name));

    return this.http.post<Complaint, FormData>(ApiEndpoint.COMPLAINTS, body);
  }
}
