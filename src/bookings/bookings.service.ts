import { Injectable } from '@nestjs/common';
import { BookingsRepository } from './bookings.repository';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(private readonly bookingsRepository: BookingsRepository) {}

  create(createBookingDto: CreateBookingDto): Booking {
    const payload = {
      flightNumber: createBookingDto.flightNumber,
      passengerName: createBookingDto.passengerName,
      seat: createBookingDto.seatPreference,
    };
    return this.bookingsRepository.create(payload);
  }

  findAll(): Booking[] {
    return this.bookingsRepository.findAll();
  }

  findOne(id: string): Booking | undefined {
    return this.bookingsRepository.findById(id);
  }

  updateStatus(id: string, status: Booking['status']): Booking {
    return this.bookingsRepository.updateStatus(id, status);
  }
}
