export interface Service {
  id: number;
  title: string;
  description: string;
  iconName: string;
}

export interface Review {
  id: number;
  name: string;
  text: string;
  rating: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum BookingStatus {
  IDLE = 'IDLE',
  SUBMITTING = 'SUBMITTING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}