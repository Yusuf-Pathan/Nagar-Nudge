import { ComplaintStatus } from '../enums/complaint-status.enum';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface ComplaintMedia {
  type: string;
  url: string;
}

export interface Complaint {
  id: string;
  category: string;
  title: string;
  description?: string | null;
  status: ComplaintStatus;
  address?: string | null;
  location?: GeoPoint | null;
  media?: ComplaintMedia[];
  submittedAt: string;
  resolvedAt?: string | null;
}

/** Shape returned by GET /complaints/resolved */
export interface ResolvedComplaintDto {
  id: string;
  title: string;
  category: string;
  address: string | null;
  coverImage: string | null;
  resolvedAt: string;
  submittedAt: string;
}

/** View model used by the home page card */
export interface ResolvedComplaint extends ResolvedComplaintDto {
  daysAgo: number;
}

export interface CreateComplaintRequest {
  category: string;
  title: string;
  description?: string;
  location: GeoPoint;
  media: File[];
}
