import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { EventsRepository } from '../repositories/events.repository';
import { CreateEventsDto } from '../dto/create-events.dto';
import { UpdateEventsDto } from '../dto/update-events.dto';
import { Events } from '../entities/events.entity';

/**
 * Events Service
 * Handles events business logic and database operations
 */
@Injectable()
export class EventsService {
  constructor(
    private readonly eventsRepository: EventsRepository,
  ) {}

  /**
   * Create new events record
   * Validates uniqueness and creates new entry
   */
  async create(createEventsDto: CreateEventsDto): Promise<Events> {
    if (createEventsDto.name) {
      const existing = await this.eventsRepository.findByName(createEventsDto.name);
      if (existing) {
        throw new ConflictException('Events with this name already exists');
      }
    }

    return this.eventsRepository.create(createEventsDto);
  }

  /**
   * Get all events records
   * Returns complete list of events entries
   */
  async findAll(): Promise<Events[]> {
    return this.eventsRepository.findAll();
  }

  /**
   * Find events by unique ID
   * Returns events details or throws not found exception
   */
  async findOne(id: string): Promise<Events> {
    const events = await this.eventsRepository.findById(id);
    if (!events) {
      throw new NotFoundException('Events not found');
    }
    return events;
  }

  /**
   * Update events information
   * Validates uniqueness and updates existing record
   */
  async update(id: string, updateEventsDto: UpdateEventsDto): Promise<Events> {
    const events = await this.findOne(id);
    
    if (updateEventsDto.name && updateEventsDto.name !== events.name) {
      const existing = await this.eventsRepository.findByName(updateEventsDto.name);
      if (existing) {
        throw new ConflictException('Events with this name already exists');
      }
    }

    return this.eventsRepository.update(id, updateEventsDto);
  }

  /**
   * Delete events record
   * Permanently removes events from database
   */
  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.eventsRepository.remove(id);
  }
}
