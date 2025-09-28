import { Injectable } from '@nestjs/common';
import {
  Booking,
  createTimestamps,
  updateTimestamp,
} from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

@Injectable()
export class BookingsRepository {
  private readonly store: Map<string, Booking> = new Map();

  findAll(): Booking[] {
    return Array.from(this.store.values());
  }

  findById(id: string): Booking | undefined {
    return this.store.get(id);
  }

  exists(id: string): boolean {
    return this.store.has(id);
  }

  create(createBookingDto: CreateBookingDto): Booking {
    const id = crypto.randomUUID();
    const timestamps = createTimestamps();

    const booking: Booking = {
      id,
      passengerName: createBookingDto.passengerName,
      flightNumber: createBookingDto.flightNumber,
      departureDate: createBookingDto.departureDate,
      returnDate: createBookingDto.returnDate,
      status: 'pending' as BookingStatus,
      ...timestamps,
    };

    this.store.set(id, booking);
    return booking;
  }

  updateStatus(id: string, status: BookingStatus): Booking {
    const booking = this.findById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (!this.isValidStatusTransition(booking.status, status)) {
      throw new Error('Invalid status transition');
    }

    const updatedBooking: Booking = {
      ...booking,
      status,
      updatedAt: updateTimestamp(),
    };

    this.store.set(id, updatedBooking);
    return updatedBooking;
  }

  private isValidStatusTransition(
    current: BookingStatus,
    target: BookingStatus,
  ): boolean {
    const validTransitions: Record<BookingStatus, BookingStatus[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['cancelled'],
      cancelled: [],
    };

    return validTransitions[current].includes(target);
  }
}
