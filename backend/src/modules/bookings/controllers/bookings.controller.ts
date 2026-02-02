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

  /**
   * Create new bookings
   * Creates a new bookings record with provided data
   */
  @ApiOperation({ summary: 'Create new bookings' })
  @ApiBearerAuth()
  @Post()
  create(@Body() createBookingsDto: CreateBookingsDto) {
    return this.bookingsService.create(createBookingsDto);
  }

  /**
   * Get all bookings records
   * Returns paginated list of all bookings entries
   */
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  /**
   * Get bookings by ID
   * Returns specific bookings details by unique identifier
   */
  @ApiOperation({ summary: 'Get bookings by ID' })
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  /**
   * Update bookings information
   * Updates existing bookings with provided data
   */
  @ApiOperation({ summary: 'Update bookings' })
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingsDto: UpdateBookingsDto) {
    return this.bookingsService.update(id, updateBookingsDto);
  }

  /**
   * Delete bookings record
   * Permanently removes bookings from database
   */
  @ApiOperation({ summary: 'Delete bookings' })
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}
