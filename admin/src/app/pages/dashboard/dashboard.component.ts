import { Component, OnInit } from '@angular/core';

import { ComplaintStatus } from '../../core/enums/complaint-status.enum';
import { DashboardData } from '../../core/models';
import { ComplaintService } from '../../core/services/complaint.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  data: DashboardData | null = null;
  loading = true;
  errorMessage = '';

  /** Chart geometry helpers */
  readonly chartWidth = 560;
  readonly chartHeight = 220;
  readonly chartPadX = 36;
  readonly chartPadY = 16;

  constructor(private complaintService: ComplaintService) {}

  ngOnInit(): void {
    this.complaintService.getDashboard().subscribe({
      next: (data) => {
        this.data = data;
        this.loading = false;
      },
      error: (err: Error) => {
        this.errorMessage = err.message;
        this.loading = false;
      },
    });
  }

  get trend(): { label: string; total: number; resolved: number }[] {
    return this.data?.trend ?? [];
  }

  get maxY(): number {
    const max = Math.max(1, ...this.trend.map((t) => t.total), ...this.trend.map((t) => t.resolved));
    // Round up to a friendly step
    const step = Math.pow(10, Math.floor(Math.log10(max)));
    return Math.ceil(max / step) * step;
  }

  totalPath(): string {
    return this.linePath('total');
  }

  resolvedPath(): string {
    return this.linePath('resolved');
  }

  yTicks(): number[] {
    const max = this.maxY;
    return [0, max / 2, max];
  }

  formatTime(iso?: string | null): string {
    if (!iso) return '—';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return '1d ago';
    return `${days}d ago`;
  }

  private linePath(key: 'total' | 'resolved'): string {
    const points = this.trend;
    if (!points.length) return '';

    const innerW = this.chartWidth - this.chartPadX * 2;
    const innerH = this.chartHeight - this.chartPadY * 2;
    const max = this.maxY || 1;
    const n = points.length;

    return points
      .map((p, i) => {
        const x = this.chartPadX + (n === 1 ? innerW / 2 : (i * innerW) / (n - 1));
        const y = this.chartPadY + innerH - (p[key] / max) * innerH;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }

  yFor(value: number): number {
    const innerH = this.chartHeight - this.chartPadY * 2;
    const max = this.maxY || 1;
    return this.chartPadY + innerH - (value / max) * innerH;
  }

  xFor(index: number): number {
    const innerW = this.chartWidth - this.chartPadX * 2;
    const n = this.trend.length || 1;
    return this.chartPadX + (n === 1 ? innerW / 2 : (index * innerW) / (n - 1));
  }

  statusLabel(status: ComplaintStatus): string {
    return status;
  }
}
