import { ComplaintStatus } from '../enums/complaint-status.enum';
import { Complaint } from '../models';

const daysAgoIso = (days: number): string =>
  new Date(Date.now() - days * 86400000).toISOString();

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: '1',
    category: 'ROADS',
    title: 'Pothole on MG Road',
    description: 'Large pothole near the bus stop.',
    status: ComplaintStatus.RESOLVED,
    location: null,
    mediaUrls: ['assets/images/resolved/pothole.jpg'],
    createdAt: daysAgoIso(2)
  },
  {
    id: '2',
    category: 'STREETLIGHTS',
    title: 'Streetlight not working',
    description: '',
    status: ComplaintStatus.IN_PROGRESS,
    location: null,
    mediaUrls: ['assets/images/resolved/streetlight.jpg'],
    createdAt: daysAgoIso(3)
  },
  {
    id: '3',
    category: 'GARBAGE',
    title: 'Garbage not collected',
    description: 'Not collected for three days.',
    status: ComplaintStatus.PENDING,
    location: null,
    mediaUrls: ['assets/images/resolved/garbage.jpg'],
    createdAt: daysAgoIso(4)
  }
];
