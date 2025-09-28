import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { UuidDto } from './dto/uuid.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.createBooking(createBookingDto);
  }

  @Get()
  findAllBookings() {
    return this.bookingsService.findAllBookings();
  }

  @Get(':id')
  findBookingById(@Param() params: UuidDto) {
    return this.bookingsService.findBookingById(params.id);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  updateBookingStatus(
    @Param() params: UuidDto,
    @Body() updateBookingStatusDto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateBookingStatus(
      params.id,
      updateBookingStatusDto,
    );
  }
}
