import { IsString, IsNotEmpty, IsOptional, MaxLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingsDto {
  @ApiProperty({ 
    description: 'The unique UUID of the event', 
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851' 
  })
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({ 
    description: 'Additional notes or special requests for this booking', 
    example: 'I need a front-row seat if possible.',
    required: false,
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}