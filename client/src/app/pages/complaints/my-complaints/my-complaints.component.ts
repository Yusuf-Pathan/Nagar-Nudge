import { Component, OnInit } from '@angular/core';

import { ComplaintStatus } from '../../../core/enums/complaint-status.enum';
import { Complaint } from '../../../core/models';
import { ComplaintService } from '../../../core/services/complaint.service';

export type StatusFilter = 'all' | ComplaintStatus;

@Component({
  selector: 'app-my-complaints',
  templateUrl: './my-complaints.component.html',
  styleUrls: ['./my-complaints.component.scss'],
})
export class MyComplaintsComponent implements OnInit {
  readonly filters: StatusFilter[] = [
    'all',
    ComplaintStatus.PENDING,
    ComplaintStatus.IN_PROGRESS,
    ComplaintStatus.RESOLVED,
    ComplaintStatus.REJECTED,
  ];

  complaints: Complaint[] = [];
  activeFilter: StatusFilter = 'all';
  loading = true;

  constructor(private complaintService: ComplaintService) {}

  ngOnInit(): void {
    this.complaintService.getMyComplaints().subscribe((list) => {
      this.complaints = list;
      this.loading = false;
    });
  }

  get filtered(): Complaint[] {
    return this.activeFilter === 'all'
      ? this.complaints
      : this.complaints.filter((c) => c.status === this.activeFilter);
  }
}
