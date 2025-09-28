import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import {
  IsDateString,
  IsFutureDate,
  IsDateAfter,
  IsNotNumericString,
} from '../validators/custom-validators';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @IsNotNumericString()
  passengerName!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{2}\d{3}(-[A-Z0-9]+)?$/, {
    message: 'Flight number must be in format AA123 or AA123-1',
  })
  flightNumber!: string;

  @IsDateString()
  @IsFutureDate()
  @IsNotEmpty()
  departureDate!: string;

  @IsDateString()
  @IsOptional()
  @IsDateAfter('departureDate')
  returnDate?: string;
}
