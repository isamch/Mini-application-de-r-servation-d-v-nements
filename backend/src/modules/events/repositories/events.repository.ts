import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Events, EventStatus } from '../entities/events.entity';

/**
 * Events Repository
 * Handles database operations for the Events entity
 */
@Injectable()
export class EventsRepository {
  constructor(
    @InjectRepository(Events)
    private readonly repository: Repository<Events>,
  ) { }

  /**
   * Create a new event record
   * @param data - New event data
   * @returns The created event
   */
  async create(data: Partial<Events>): Promise<Events> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  /**
   * Retrieve all event records
   * @returns A list of all events with creator relations
   */
  async findAll(): Promise<Events[]> {
    return this.repository.find({
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find an event by its unique ID
   * @param id - Event ID
   * @returns The event record or null if not found
   */
  async findById(id: string): Promise<Events | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
  }

  /**
   * Find only events with 'PUBLISHED' status
   * @returns List of published events ordered by date
   */
  async findPublished(): Promise<Events[]> {
    return this.repository.find({
      where: { status: EventStatus.PUBLISHED },
      relations: ['createdBy'],
      order: { date: 'ASC' },
    });
  }

  /**
   * Find events created by a specific user
   * @param createdById - ID of the event creator
   * @returns List of events created by the user
   */
  async findByCreator(createdById: string): Promise<Events[]> {
    return this.repository.find({
      where: { createdById },
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find an event by its title
   * @param title - The event title
   * @returns The event record or null if not found
   */
  async findByTitle(title: string): Promise<Events | null> {
    return this.repository.findOne({
      where: { title },
      relations: ['createdBy'],
    });
  }


  /**
   * Find events by status
   * Returns events with specific status
   */
  async findByStatus(status: EventStatus): Promise<Events[]> {
    return this.repository.find({
      where: { status },
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }


  /**
   * Find events occurring on a specific date
   * @param date - The target date
   * @returns List of events on that date
   */
  async findByDate(date: Date): Promise<Events[]> {
    return this.repository.find({
      where: { date },
      relations: ['createdBy'],
      order: { startTime: 'ASC' },
    });
  }

  /**
   * Update event data
   * @param id - Event ID
   * @param data - Updated data fields
   * @returns The updated event record
   */
  async update(id: string, data: Partial<Events>): Promise<Events> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  /**
   * Update the status of an event
   * @param id - Event ID
   * @param status - The new status
   * @returns The updated event record
   */
  async updateStatus(id: string, status: EventStatus): Promise<Events> {
    await this.repository.update(id, { status });
    return this.findById(id);
  }

  /**
   * Update current bookings count manually
   * @param id - Event ID
   * @param count - The new booking count
   * @returns The updated event record
   */
  async updateBookingsCount(id: string, count: number): Promise<Events> {
    await this.repository.update(id, { currentBookings: count });
    return this.findById(id);
  }

  /**
   * Atomically increment bookings count by one
   * @param id - Event ID
   * @returns The updated event record
   */
  async incrementBookings(id: string): Promise<Events> {
    await this.repository.increment({ id }, 'currentBookings', 1);
    return this.findById(id);
  }

  /**
   * Atomically decrement bookings count by one
   * @param id - Event ID
   * @returns The updated event record
   */
  async decrementBookings(id: string): Promise<Events> {
    await this.repository.decrement({ id }, 'currentBookings', 1);
    return this.findById(id);
  }

  /**
   * Permanently delete an event record
   * @param id - Event ID
   */
  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * Check if the event has remaining capacity
   * @param id - Event ID
   * @returns True if current bookings are less than max capacity
   */
  async hasAvailableSpots(id: string): Promise<boolean> {
    const event = await this.findById(id);
    if (!event) return false;
    return event.currentBookings < event.maxCapacity;
  }

  /**
   * Calculate the number of available spots
   * @param id - Event ID
   * @returns Number of spots left (returns 0 if event not found or full)
   */
  async getAvailableSpots(id: string): Promise<number> {
    const event = await this.findById(id);
    if (!event) return 0;
    return Math.max(0, event.maxCapacity - event.currentBookings);
  }



}