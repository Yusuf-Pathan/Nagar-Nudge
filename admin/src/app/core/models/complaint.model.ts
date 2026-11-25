import { ComplaintStatus } from '../enums/complaint-status.enum';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface ComplaintMedia {
  type: string;
  url: string;
}

export interface ComplaintUserRef {
  id: string;
  name: string;
}

/** Shape returned by GET /complaints and dashboard recent list */
export interface Complaint {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  categoryName?: string;
  status: ComplaintStatus;
  address?: string | null;
  location?: GeoPoint | null;
  media?: ComplaintMedia[];
  assignedTo?: string | null;
  assignedAt?: string | null;
  assignee?: ComplaintUserRef | null;
  user?: ComplaintUserRef | null;
  submittedAt: string;
  resolvedAt?: string | null;
}

export interface AssignComplaintRequest {
  assigneeId: string | null;
}
