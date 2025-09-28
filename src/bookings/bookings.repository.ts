import { Injectable } from '@nestjs/common';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsRepository {
  private readonly store: Booking[] = [];

  findAll(): Booking[] {
    return this.store;
  }

  findById(id: string): Booking | undefined {
    return this.store.find((booking) => booking.id === id);
  }

  create(payload: Partial<Booking>): Booking {
    const now = new Date();
    const booking: Booking = {
      id: crypto.randomUUID(),
      flightNumber: payload.flightNumber!,
      passengerName: payload.passengerName!,
      seat: payload.seat,
      status: payload.status || 'PENDING',
      createdAt: now,
      updatedAt: now,
    };
    this.store.push(booking);
    return booking;
  }

  updateStatus(id: string, status: Booking['status']): Booking {
    const booking = this.findById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    booking.status = status;
    booking.updatedAt = new Date();
    return booking;
  }
}
