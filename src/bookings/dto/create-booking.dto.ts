import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  flightNumber!: string;

  @IsString()
  @IsNotEmpty()
  passengerName!: string;

  @IsString()
  @IsOptional()
  seatPreference?: string;
}
