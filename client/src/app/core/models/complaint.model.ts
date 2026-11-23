export type ComplaintStatus = 'pending' | 'in-progress' | 'resolved';

export interface Complaint {
  id: string;
  title: string;
  status: ComplaintStatus;
  imageUrl: string;
  daysAgo: number;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface CreateComplaintRequest {
  category: string;
  title: string;
  description?: string;
  location?: GeoPoint | null;
  media: File[];
}
