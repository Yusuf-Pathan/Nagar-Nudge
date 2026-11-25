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
  readonly Status = ComplaintStatus;

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
  successMessage = '';
  page = 1;
  readonly limit = 10;
  savingId: string | null = null;

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

  /** Show resolve/reject while work is open; start while pending; reopen after terminal. */
  canResolve(c: Complaint): boolean {
    return c.status === ComplaintStatus.PENDING || c.status === ComplaintStatus.IN_PROGRESS;
  }

  canReject(c: Complaint): boolean {
    return c.status === ComplaintStatus.PENDING || c.status === ComplaintStatus.IN_PROGRESS;
  }

  canStart(c: Complaint): boolean {
    return c.status === ComplaintStatus.PENDING;
  }

  canReopen(c: Complaint): boolean {
    return c.status === ComplaintStatus.RESOLVED || c.status === ComplaintStatus.REJECTED;
  }

  changeStatus(complaint: Complaint, status: ComplaintStatus): void {
    if (this.savingId) return;

    this.savingId = complaint.id;
    this.errorMessage = '';
    this.successMessage = '';

    this.complaintService.updateStatus(complaint.id, status).subscribe({
      next: (res) => {
        this.savingId = null;
        if (res.data) {
          const idx = this.complaints.findIndex((c) => c.id === complaint.id);
          if (idx >= 0) this.complaints[idx] = res.data;
        }
        this.successMessage = res.message || 'Status updated';
        // If a status filter is active, the row may no longer belong in the list
        if (this.activeFilter !== 'all') {
          this.load();
        }
      },
      error: (err: Error) => {
        this.savingId = null;
        this.errorMessage = err.message;
      },
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
