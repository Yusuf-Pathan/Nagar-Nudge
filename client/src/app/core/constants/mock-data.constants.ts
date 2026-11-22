import { Complaint } from '../models/index';

export const MOCK_RESOLVED_COMPLAINTS: Complaint[] = [
  {
    id: '1',
    title: 'Pothole on MG Road',
    status: 'resolved',
    imageUrl: 'assets/images/resolved/pothole.jpg',
    daysAgo: 2
  },
  {
    id: '2',
    title: 'Streetlight not working',
    status: 'resolved',
    imageUrl: 'assets/images/resolved/streetlight.jpg',
    daysAgo: 3
  },
  {
    id: '3',
    title: 'Garbage not collected',
    status: 'resolved',
    imageUrl: 'assets/images/resolved/garbage.jpg',
    daysAgo: 4
  }
];
