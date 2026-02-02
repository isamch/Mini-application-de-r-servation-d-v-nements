import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Create Bookings DTO
 * Data transfer object for creating new bookings
 */
export class CreateBookingsDto {
  @ApiProperty({ description: 'Bookings name', example: 'Sample Bookings' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Bookings description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Active status', default: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
