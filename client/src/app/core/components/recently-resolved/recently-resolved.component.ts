import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ResolvedComplaint } from '../../../core/models';
import { ComplaintService } from '../../../core/services/complaint.service';

@Component({
  selector: 'app-recently-resolved',
  templateUrl: './recently-resolved.component.html'
})
export class RecentlyResolvedComponent implements OnInit {
  resolved$!: Observable<ResolvedComplaint[]>;

  constructor(private complaintService: ComplaintService) {}

  ngOnInit(): void {
    this.resolved$ = this.complaintService.getResolvedComplaints(6);
  }
}
