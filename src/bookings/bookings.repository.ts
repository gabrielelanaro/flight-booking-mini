import { Injectable, NotFoundException } from '@nestjs/common';
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
    const bookingIndex = this.store.findIndex((booking) => booking.id === id);

    if (bookingIndex === -1) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }

    const booking = this.store[bookingIndex];
    const updatedBooking = {
      ...booking,
      status,
      updatedAt: new Date(),
    };

    this.store[bookingIndex] = updatedBooking;
    return updatedBooking;
  }
}
