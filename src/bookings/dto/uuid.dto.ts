import { IsString, IsNotEmpty } from 'class-validator';
import { IsUUID } from '../validators/custom-validators';

export class UuidDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id!: string;
}
