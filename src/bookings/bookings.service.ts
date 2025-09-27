import { Injectable, NotImplementedException } from '@nestjs/common';
import { BookingsRepository } from './bookings.repository';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(private readonly bookingsRepository: BookingsRepository) {}

  create(createBookingDto: CreateBookingDto): Booking {
    // Service logic intentionally left out for workshop implementation.
    throw new NotImplementedException('create booking flow not implemented');
  }

  findAll(): Booking[] {
    return this.bookingsRepository.findAll();
  }

  findOne(id: string): Booking | undefined {
    return this.bookingsRepository.findById(id);
  }

  updateStatus(id: string, status: Booking['status']): Booking {
    throw new NotImplementedException('status updates not implemented');
  }
}
