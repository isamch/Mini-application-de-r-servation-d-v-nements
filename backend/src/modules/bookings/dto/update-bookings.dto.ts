// src/modules/bookings/dto/update-bookings.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingsDto } from './create-bookings.dto';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../entities/bookings.entity';

/**
 * Update Bookings DTO
 * Data transfer object for updating existing booking
 */
export class UpdateBookingsDto extends PartialType(CreateBookingsDto) {
  @ApiProperty({
    description: 'Booking status',
    enum: BookingStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiProperty({
    description: 'Reason for cancellation or refusal',
    required: false,
    maxLength: 300
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  cancelReason?: string;
}
