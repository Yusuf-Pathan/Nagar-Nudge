import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ComplaintStatus } from '../../../core/enums/complaint-status.enum';
import { Complaint, PaginationMeta } from '../../../core/models';
import { ComplaintService } from '../../../core/services/complaint.service';

export type StatusFilter = 'all' | ComplaintStatus;

@Component({
  selector: 'app-all-complaints',
  templateUrl: './all-complaints.component.html',
  styleUrls: ['./all-complaints.component.scss'],
})
export class AllComplaintsComponent implements OnInit {
  readonly filters: StatusFilter[] = [
    'all',
    ComplaintStatus.PENDING,
    ComplaintStatus.IN_PROGRESS,
    ComplaintStatus.RESOLVED,
    ComplaintStatus.REJECTED,
  ];

  complaints: Complaint[] = [];
  meta: PaginationMeta | undefined;
  activeFilter: StatusFilter = 'all';
  search = '';
  loading = true;
  errorMessage = '';
  page = 1;
  readonly limit = 10;

  constructor(
    private complaintService: ComplaintService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.search = params.get('search') ?? '';
      this.page = Number(params.get('page')) || 1;
      this.load();
    });
  }

  setFilter(f: StatusFilter): void {
    this.activeFilter = f;
    this.page = 1;
    this.load();
  }

  onSearch(): void {
    this.page = 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: this.search || null, page: null },
      queryParamsHandling: 'merge',
    });
  }

  setPage(page: number): void {
    if (page < 1 || (this.meta && page > this.meta.totalPages)) return;
    this.page = page;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  private load(): void {
    this.loading = true;
    this.errorMessage = '';
    this.complaintService
      .getAll({
        status: this.activeFilter === 'all' ? undefined : this.activeFilter,
        search: this.search || undefined,
        page: this.page,
        limit: this.limit,
      })
      .subscribe({
        next: ({ items, meta }) => {
          this.complaints = items;
          this.meta = meta;
          this.loading = false;
        },
        error: (err: Error) => {
          this.errorMessage = err.message;
          this.loading = false;
        },
      });
  }
}
