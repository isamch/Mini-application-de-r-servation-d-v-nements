import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { EventsRepository } from '../repositories/events.repository';
import { CreateEventsDto } from '../dto/create-events.dto';
import { UpdateEventsDto } from '../dto/update-events.dto';
import { Events, EventStatus } from '../entities/events.entity';
import { UserRole } from '../../../common/constants/roles.constant';

/**
 * Events Service
 * Handles events business logic and database operations
 */
@Injectable()
export class EventsService {
  constructor(
    private readonly eventsRepository: EventsRepository,
  ) { }

  /**
   * Create new event
   * Validates data and creates new event record
   * @param createEventsDto - Event creation data
   * @param userId - ID of the user creating the event
   * @returns Created event
   */
  async create(createEventsDto: CreateEventsDto, userId: string): Promise<Events> {
    // Check if event with same title already exists
    const existingEvent = await this.eventsRepository.findByTitle(createEventsDto.title);
    if (existingEvent) {
      throw new ConflictException('Event with this title already exists');
    }

    // Validate event date is in the future
    const eventDate = new Date(createEventsDto.date);
    if (eventDate <= new Date()) {
      throw new BadRequestException('Event date must be in the future');
    }

    // Validate capacity
    if (createEventsDto.maxCapacity <= 0) {
      throw new BadRequestException('Event capacity must be greater than 0');
    }

    // Create event with creator ID
    const eventData = {
      ...createEventsDto,
      createdById: userId,
      date: eventDate,
    };

    return this.eventsRepository.create(eventData);
  }

  /**
   * Get all events (Admin only)
   * Returns complete list of all events regardless of status
   * @returns Array of all events
   */
  async findAll(): Promise<Events[]> {
    return this.eventsRepository.findAll();
  }

  /**
   * Get published events only
   * Returns events available for public booking
   * @returns Array of published events
   */
  async findPublished(): Promise<Events[]> {
    return this.eventsRepository.findPublished();
  }

  /**
   * Get events created by specific user
   * Returns events created by the specified user
   * @param userId - Creator's user ID
   * @returns Array of user's events
   */
  async findByCreator(userId: string): Promise<Events[]> {
    return this.eventsRepository.findByCreator(userId);
  }

  /**
   * Find event by unique ID
   * Returns event details or throws not found exception
   * @param id - Event ID
   * @returns Event details
   */
  async findOne(id: string): Promise<Events> {
    const event = await this.eventsRepository.findById(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  /**
   * Get events by date
   * Returns all events scheduled for specific date
   * @param date - Target date
   * @returns Array of events on that date
   */
  async findByDate(date: Date): Promise<Events[]> {
    return this.eventsRepository.findByDate(date);
  }

  /**
   * Update event information
   * Validates permissions and updates existing event
   * @param id - Event ID
   * @param updateEventsDto - Update data
   * @param userId - ID of user making the update
   * @param userRole - Role of user making the update
   * @returns Updated event
   */
  async update(
    id: string,
    updateEventsDto: UpdateEventsDto,
    userId: string,
    userRole: UserRole
  ): Promise<Events> {
    const event = await this.findOne(id);

    // Check permissions: only admin or event creator can update
    if (userRole !== UserRole.ADMIN && event.createdById !== userId) {
      throw new ForbiddenException('You can only update events you created');
    }

    // Validate title uniqueness if title is being changed
    if (updateEventsDto.title && updateEventsDto.title !== event.title) {
      const existingEvent = await this.eventsRepository.findByTitle(updateEventsDto.title);
      if (existingEvent) {
        throw new ConflictException('Event with this title already exists');
      }
    }

    // Validate date if being changed
    if (updateEventsDto.date) {
      const newDate = new Date(updateEventsDto.date);
      if (newDate <= new Date()) {
        throw new BadRequestException('Event date must be in the future');
      }
    }

    // Validate capacity if being changed
    if (updateEventsDto.maxCapacity !== undefined) {
      if (updateEventsDto.maxCapacity <= 0) {
        throw new BadRequestException('Event capacity must be greater than 0');
      }

      // Cannot reduce capacity below current bookings
      if (updateEventsDto.maxCapacity < event.currentBookings) {
        throw new BadRequestException(
          `Cannot reduce capacity below current bookings (${event.currentBookings})`
        );
      }
    }

    return this.eventsRepository.update(id, updateEventsDto);
  }

  /**
   * Update event status
   * Changes event status (publish, cancel, etc.)
   * @param id - Event ID
   * @param status - New status
   * @param userId - ID of user making the change
   * @param userRole - Role of user making the change
   * @returns Updated event
   */
  async updateStatus(
    id: string,
    status: EventStatus,
    userId: string,
    userRole: UserRole
  ): Promise<Events> {
    const event = await this.findOne(id);

    // Check permissions
    if (userRole !== UserRole.ADMIN && event.createdById !== userId) {
      throw new ForbiddenException('You can only update events you created');
    }

    // Validate status transitions
    if (event.status === EventStatus.CANCELED && status !== EventStatus.CANCELED) {
      throw new BadRequestException('Cannot change status of a canceled event');
    }

    // Cannot publish event in the past
    if (status === EventStatus.PUBLISHED && new Date(event.date) <= new Date()) {
      throw new BadRequestException('Cannot publish event scheduled in the past');
    }

    return this.eventsRepository.updateStatus(id, status);
  }

  /**
   * Delete event
   * Permanently removes event from database
   * @param id - Event ID
   * @param userId - ID of user requesting deletion
   * @param userRole - Role of user requesting deletion
   */
  async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
    const event = await this.findOne(id);

    // Check permissions
    if (userRole !== UserRole.ADMIN && event.createdById !== userId) {
      throw new ForbiddenException('You can only delete events you created');
    }

    // Cannot delete event with existing bookings
    if (event.currentBookings > 0) {
      throw new BadRequestException('Cannot delete event with existing bookings');
    }

    await this.eventsRepository.remove(id);
  }

  /**
   * Check if event has available spots
   * Validates if new bookings can be made
   * @param id - Event ID
   * @returns True if spots are available
   */
  async hasAvailableSpots(id: string): Promise<boolean> {
    return this.eventsRepository.hasAvailableSpots(id);
  }

  /**
   * Get available spots count
   * Returns number of remaining spots for booking
   * @param id - Event ID
   * @returns Number of available spots
   */
  async getAvailableSpots(id: string): Promise<number> {
    return this.eventsRepository.getAvailableSpots(id);
  }

  /**
   * Increment bookings count
   * Called when a new booking is confirmed
   * @param id - Event ID
   * @returns Updated event
   */
  async incrementBookings(id: string): Promise<Events> {
    const event = await this.findOne(id);

    // Check if event can accept more bookings
    if (event.currentBookings >= event.maxCapacity) {
      throw new BadRequestException('Event is at full capacity');
    }

    return this.eventsRepository.incrementBookings(id);
  }

  /**
   * Decrement bookings count
   * Called when a booking is canceled
   * @param id - Event ID
   * @returns Updated event
   */
  async decrementBookings(id: string): Promise<Events> {
    const event = await this.findOne(id);

    // Ensure we don't go below zero
    if (event.currentBookings <= 0) {
      throw new BadRequestException('No bookings to cancel');
    }

    return this.eventsRepository.decrementBookings(id);
  }

  /**
   * Validate event for booking
   * Checks if event can accept new bookings
   * @param id - Event ID
   * @returns Event if valid for booking
   */
  async validateForBooking(id: string): Promise<Events> {
    const event = await this.findOne(id);

    // Check event status
    if (event.status !== EventStatus.PUBLISHED) {
      throw new BadRequestException('Event is not available for booking');
    }

    // Check if event is in the future
    if (new Date(event.date) <= new Date()) {
      throw new BadRequestException('Cannot book past events');
    }

    // Check capacity
    if (event.currentBookings >= event.maxCapacity) {
      throw new BadRequestException('Event is at full capacity');
    }

    return event;
  }
}
