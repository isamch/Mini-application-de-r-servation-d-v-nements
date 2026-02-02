// src/modules/bookings/repositories/bookings.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookings, BookingStatus } from '../entities/bookings.entity';

/**
 * Bookings Repository
 * Handles database operations for Bookings entity
 */
@Injectable()
export class BookingsRepository {
  constructor(
    @InjectRepository(Bookings)
    private readonly repository: Repository<Bookings>,
  ) { }

  /**
   * Create new booking
   */
  async create(data: Partial<Bookings>): Promise<Bookings> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  /**
   * Find booking by ID
   */
  async findById(id: string): Promise<Bookings | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user', 'event'],
    });
  }

  /**
   * Find all bookings
   */
  async findAll(): Promise<Bookings[]> {
    return this.repository.find({
      relations: ['user', 'event'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find bookings by user
   */
  async findByUser(userId: string): Promise<Bookings[]> {
    return this.repository.find({
      where: { userId },
      relations: ['event'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find bookings by event
   */
  async findByEvent(eventId: string): Promise<Bookings[]> {
    return this.repository.find({
      where: { eventId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find user booking for specific event
   */
  async findUserBookingForEvent(userId: string, eventId: string): Promise<Bookings | null> {
    return this.repository.findOne({
      where: { userId, eventId },
      relations: ['user', 'event'],
    });
  }

  /**
   * Count bookings by status for event
   */
  async countByStatusAndEvent(eventId: string, status: BookingStatus): Promise<number> {
    return this.repository.count({
      where: { eventId, status },
    });
  }

  /**
   * Find bookings by status
   */
  async findByStatus(status: BookingStatus): Promise<Bookings[]> {
    return this.repository.find({
      where: { status },
      relations: ['user', 'event'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Update booking
   */
  async update(id: string, data: Partial<Bookings>): Promise<Bookings> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  /**
   * Delete booking
   */
  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * Check if user already booked event
   */
  async hasUserBookedEvent(userId: string, eventId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: {
        userId,
        eventId,
        status: BookingStatus.CONFIRMED
      },
    });
    return count > 0;
  }
}
