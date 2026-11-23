import { ComplaintStatus } from '../enums/complaint-status.enum';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface Complaint {
  id: string;
  category: string;
  title: string;
  description?: string | null;
  status: ComplaintStatus;
  location?: GeoPoint | null;
  mediaUrls: string[];
  createdAt: string; // ISO date from the API
}

/** Compact shape used by the "Recently Resolved" section on the home page. */
export interface ResolvedComplaint {
  id: string;
  title: string;
  imageUrl: string;
  daysAgo: number;
}

export interface CreateComplaintRequest {
  category: string;
  title: string;
  description?: string;
  location: GeoPoint; // required
  media: File[];
}
