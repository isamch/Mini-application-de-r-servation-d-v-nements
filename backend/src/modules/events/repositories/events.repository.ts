import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Events } from '../entities/events.entity';

/**
 * Events Repository
 * Handles database operations for Events entity
 */
@Injectable()
export class EventsRepository {
  constructor(
    @InjectRepository(Events)
    private readonly repository: Repository<Events>,
  ) {}

  /**
   * Create new events record
   * Saves new entity to database
   */
  async create(data: Partial<Events>): Promise<Events> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  /**
   * Get all events records
   * Returns all entities from database
   */
  async findAll(): Promise<Events[]> {
    return this.repository.find();
  }

  /**
   * Find events by unique ID
   * Returns entity or null if not found
   */
  async findById(id: string): Promise<Events | null> {
    return this.repository.findOne({ where: { id } });
  }

  /**
   * Update events record
   * Updates entity and returns updated record
   */
  async update(id: string, data: Partial<Events>): Promise<Events> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  /**
   * Delete events record
   * Permanently removes entity from database
   */
  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * Find events by name
   * Returns entity with matching name or null
   */
  async findByName(name: string): Promise<Events | null> {
    return this.repository.findOne({ where: { name } });
  }
}
