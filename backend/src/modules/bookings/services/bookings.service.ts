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

  /**
   * Create new bookings record
   * Validates uniqueness and creates new entry
   */
  async create(createBookingsDto: CreateBookingsDto): Promise<Bookings> {
    if (createBookingsDto.name) {
      const existing = await this.bookingsRepository.findByName(createBookingsDto.name);
      if (existing) {
        throw new ConflictException('Bookings with this name already exists');
      }
    }

    return this.bookingsRepository.create(createBookingsDto);
  }

  /**
   * Get all bookings records
   * Returns complete list of bookings entries
   */
  async findAll(): Promise<Bookings[]> {
    return this.bookingsRepository.findAll();
  }

  /**
   * Find bookings by unique ID
   * Returns bookings details or throws not found exception
   */
  async findOne(id: string): Promise<Bookings> {
    const bookings = await this.bookingsRepository.findById(id);
    if (!bookings) {
      throw new NotFoundException('Bookings not found');
    }
    return bookings;
  }

  /**
   * Update bookings information
   * Validates uniqueness and updates existing record
   */
  async update(id: string, updateBookingsDto: UpdateBookingsDto): Promise<Bookings> {
    const bookings = await this.findOne(id);
    
    if (updateBookingsDto.name && updateBookingsDto.name !== bookings.name) {
      const existing = await this.bookingsRepository.findByName(updateBookingsDto.name);
      if (existing) {
        throw new ConflictException('Bookings with this name already exists');
      }
    }

    return this.bookingsRepository.update(id, updateBookingsDto);
  }

  /**
   * Delete bookings record
   * Permanently removes bookings from database
   */
  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.bookingsRepository.remove(id);
  }
}
