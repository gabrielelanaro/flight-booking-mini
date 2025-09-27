export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface Booking {
  id: string;
  flightNumber: string;
  passengerName: string;
  seat?: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}
