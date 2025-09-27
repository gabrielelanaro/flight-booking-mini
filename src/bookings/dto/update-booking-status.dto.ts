import { IsIn, IsString } from 'class-validator';
import { BookingStatus } from '../entities/booking.entity';

export class UpdateBookingStatusDto {
  @IsString()
  @IsIn(['PENDING', 'CONFIRMED', 'CANCELLED'] satisfies BookingStatus[])
  status!: BookingStatus;
}
