import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../entities/bookings.entity';

/**
 * Query Bookings DTO
 * Data transfer object for filtering bookings
 */
export class QueryBookingsDto {
  @ApiProperty({ 
    description: 'Filter by booking status', 
    enum: BookingStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiProperty({ 
    description: 'Filter by event ID', 
    required: false
  })
  @IsOptional()
  @IsString()
  eventId?: string;

  @ApiProperty({ 
    description: 'Filter by user ID', 
    required: false
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
