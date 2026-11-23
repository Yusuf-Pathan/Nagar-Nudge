import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Complaint } from '../../../core/models';
import { ComplaintService } from '../../../core/services/complaint.service';

@Component({
  selector: 'app-recently-resolved',
  templateUrl: './recently-resolved.component.html',
  styleUrls: ['./recently-resolved.component.scss']
})
export class RecentlyResolvedComponent implements OnInit {
  resolved$!: Observable<Complaint[]>;

  constructor(private complaintService: ComplaintService) {}

  ngOnInit(): void {
    this.resolved$ = this.complaintService.getResolvedComplaints();
  }
}
