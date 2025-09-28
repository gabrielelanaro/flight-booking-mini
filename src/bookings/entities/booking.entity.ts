export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  passengerName: string;
  flightNumber: string;
  departureDate: string;
  returnDate?: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export function createTimestamps(): { createdAt: Date; updatedAt: Date } {
  const now = new Date();
  return { createdAt: now, updatedAt: now };
}

export function updateTimestamp(): Date {
  // Ensure timestamp is always different by adding a small increment
  const now = new Date();
  now.setMilliseconds(now.getMilliseconds() + 1);
  return now;
}
