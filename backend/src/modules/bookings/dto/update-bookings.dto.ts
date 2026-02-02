import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingsDto } from './create-bookings.dto';

/**
 * Update Bookings DTO
 * Data transfer object for updating existing bookings
 */
export class UpdateBookingsDto extends PartialType(CreateBookingsDto) {}
