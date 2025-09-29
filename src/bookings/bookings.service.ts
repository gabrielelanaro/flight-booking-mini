import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingsRepository } from './bookings.repository';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking, BookingStatus } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(private readonly bookingsRepository: BookingsRepository) {}

  create(createBookingDto: CreateBookingDto): Booking {
    return this.bookingsRepository.create({
      flightNumber: createBookingDto.flightNumber,
      passengerName: createBookingDto.passengerName,
      seat: createBookingDto.seatPreference,
    });
  }

  findAll(): Booking[] {
    return this.bookingsRepository.findAll();
  }

  findOne(id: string): Booking {
    const booking = this.bookingsRepository.findById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  updateStatus(id: string, status: BookingStatus): Booking {
    const booking = this.bookingsRepository.updateStatus(id, status);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }
}
