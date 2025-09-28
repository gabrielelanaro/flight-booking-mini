import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { BookingsRepository } from './bookings.repository';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(private readonly bookingsRepository: BookingsRepository) {}

  createBooking(createBookingDto: CreateBookingDto): Booking {
    return this.bookingsRepository.create(createBookingDto);
  }

  findAllBookings(): Booking[] {
    return this.bookingsRepository.findAll();
  }

  findBookingById(id: string): Booking {
    const booking = this.bookingsRepository.findById(id);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  updateBookingStatus(
    id: string,
    updateBookingStatusDto: UpdateBookingStatusDto,
  ): Booking {
    const booking = this.findBookingById(id);

    try {
      return this.bookingsRepository.updateStatus(
        id,
        updateBookingStatusDto.status as 'pending' | 'confirmed' | 'cancelled',
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'Invalid status transition'
      ) {
        throw new ConflictException(
          `Cannot transition booking from ${booking.status} to ${updateBookingStatusDto.status}`,
        );
      }
      throw error;
    }
  }
}
