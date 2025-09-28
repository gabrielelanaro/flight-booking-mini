import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateBookingStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'confirmed', 'cancelled'])
  status!: string;
}
