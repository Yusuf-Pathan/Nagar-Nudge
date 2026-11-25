import { Component, OnInit } from '@angular/core';

import { ComplaintStatus } from '../../../core/enums/complaint-status.enum';
import { Complaint, PaginationMeta } from '../../../core/models';
import { ComplaintService } from '../../../core/services/complaint.service';

type AssignFilter = 'unassigned' | 'assigned' | 'all';

interface AssignableUser {
  id: string;
  name: string;
  email?: string | null;
}

@Component({
  selector: 'app-assign-complaints',
  templateUrl: './assign-complaints.component.html',
  styleUrls: ['./assign-complaints.component.scss'],
})
export class AssignComplaintsComponent implements OnInit {
  readonly filters: AssignFilter[] = ['unassigned', 'assigned', 'all'];

  complaints: Complaint[] = [];
  users: AssignableUser[] = [];
  meta: PaginationMeta | undefined;
  activeFilter: AssignFilter = 'unassigned';
  loading = true;
  errorMessage = '';
  page = 1;
  readonly limit = 10;

  savingId: string | null = null;
  successMessage = '';

  constructor(private complaintService: ComplaintService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.load();
  }

  setFilter(f: AssignFilter): void {
    this.activeFilter = f;
    this.page = 1;
    this.load();
  }

  setPage(page: number): void {
    if (page < 1 || (this.meta && page > this.meta.totalPages)) return;
    this.page = page;
    this.load();
  }

  assign(complaint: Complaint, select: HTMLSelectElement): void {
    const value = select.value;
    if (!value) return;

    this.savingId = complaint.id;
    this.successMessage = '';
    this.errorMessage = '';

    this.complaintService.assign(complaint.id, value).subscribe({
      next: (res) => {
        this.savingId = null;
        if (res.data) {
          const idx = this.complaints.findIndex((c) => c.id === complaint.id);
          if (idx >= 0) this.complaints[idx] = res.data;
        }
        this.successMessage = res.message || 'Assigned';
        // Refresh current filter (unassigned list shrinks)
        this.load();
      },
      error: (err: Error) => {
        this.savingId = null;
        this.errorMessage = err.message;
      },
    });
  }

  unassign(complaint: Complaint): void {
    this.savingId = complaint.id;
    this.successMessage = '';
    this.errorMessage = '';

    this.complaintService.assign(complaint.id, null).subscribe({
      next: (res) => {
        this.savingId = null;
        if (res.data) {
          const idx = this.complaints.findIndex((c) => c.id === complaint.id);
          if (idx >= 0) this.complaints[idx] = res.data;
        }
        this.successMessage = res.message || 'Unassigned';
        this.load();
      },
      error: (err: Error) => {
        this.savingId = null;
        this.errorMessage = err.message;
      },
    });
  }

  private loadUsers(): void {
    this.complaintService.getAssignableUsers().subscribe({
      next: (users) => (this.users = users),
      error: () => (this.users = []),
    });
  }

  private load(): void {
    this.loading = true;
    this.errorMessage = '';
    const assigned =
      this.activeFilter === 'unassigned'
        ? 'false'
        : this.activeFilter === 'assigned'
          ? 'true'
          : undefined;

    this.complaintService
      .getAll({ assigned, page: this.page, limit: this.limit })
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
