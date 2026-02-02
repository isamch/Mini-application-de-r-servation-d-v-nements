import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookings } from '../entities/bookings.entity';

/**
 * Bookings Repository
 * Handles database operations for Bookings entity
 */
@Injectable()
export class BookingsRepository {
  constructor(
    @InjectRepository(Bookings)
    private readonly repository: Repository<Bookings>,
  ) {}

  /**
   * Create new bookings record
   * Saves new entity to database
   */
  async create(data: Partial<Bookings>): Promise<Bookings> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  /**
   * Get all bookings records
   * Returns all entities from database
   */
  async findAll(): Promise<Bookings[]> {
    return this.repository.find();
  }

  /**
   * Find bookings by unique ID
   * Returns entity or null if not found
   */
  async findById(id: string): Promise<Bookings | null> {
    return this.repository.findOne({ where: { id } });
  }

  /**
   * Update bookings record
   * Updates entity and returns updated record
   */
  async update(id: string, data: Partial<Bookings>): Promise<Bookings> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  /**
   * Delete bookings record
   * Permanently removes entity from database
   */
  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * Find bookings by name
   * Returns entity with matching name or null
   */
  async findByName(name: string): Promise<Bookings | null> {
    return this.repository.findOne({ where: { name } });
  }
}
