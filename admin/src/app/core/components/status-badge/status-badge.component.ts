import { Component, Input } from '@angular/core';
import { ComplaintStatus } from '../../enums/complaint-status.enum';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html'
})
export class StatusBadgeComponent {
  @Input() status: ComplaintStatus = ComplaintStatus.PENDING;
}
