import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ApiEndpoint } from '../enums/api-endpoint.enum';
import { MOCK_RESOLVED_COMPLAINTS } from '../constants/mock-data.constants';
import { Complaint } from '../models';
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
}
