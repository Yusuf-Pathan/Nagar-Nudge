export type ComplaintStatus = 'pending' | 'in-progress' | 'resolved';

export interface Complaint {
  id: string;
  title: string;
  status: ComplaintStatus;
  imageUrl: string;
  daysAgo: number;
}
