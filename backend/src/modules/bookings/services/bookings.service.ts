import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { BookingsRepository } from '../repositories/bookings.repository';
import { CreateBookingsDto } from '../dto/create-bookings.dto';
import { UpdateBookingsDto } from '../dto/update-bookings.dto';
import { Bookings } from '../entities/bookings.entity';

/**
 * Bookings Service
 * Handles bookings business logic and database operations
 */
@Injectable()
export class BookingsService {
  constructor(
    private readonly bookingsRepository: BookingsRepository,
  ) {}

  
}
