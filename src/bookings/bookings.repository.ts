import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsRepository {
  private readonly store = new Map<string, Booking>();

  findAll(): Booking[] {
    return Array.from(this.store.values());
  }

  findById(id: string): Booking | undefined {
    return this.store.get(id);
  }

  create(payload: Partial<Booking>): Booking {
    const id = randomUUID();
    const now = new Date();
    const booking: Booking = {
      id,
      flightNumber: payload.flightNumber!,
      passengerName: payload.passengerName!,
      seat: payload.seat,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
    };
    this.store.set(id, booking);
    return booking;
  }

  updateStatus(id: string, status: Booking['status']): Booking | undefined {
    const booking = this.store.get(id);
    if (!booking) {
      return undefined;
    }
    const updatedBooking: Booking = {
      ...booking,
      status,
      updatedAt: new Date(),
    };
    this.store.set(id, updatedBooking);
    return updatedBooking;
  }
}
