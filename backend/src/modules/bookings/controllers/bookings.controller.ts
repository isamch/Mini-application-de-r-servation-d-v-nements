import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookingsService } from '../services/bookings.service';
import { CreateBookingsDto } from '../dto/create-bookings.dto';
import { UpdateBookingsDto } from '../dto/update-bookings.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

/**
 * Bookings Controller
 * Handles HTTP requests for bookings management operations
 */
@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  
}
