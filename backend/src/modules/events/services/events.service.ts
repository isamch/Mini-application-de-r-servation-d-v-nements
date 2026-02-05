import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { EventsRepository } from '../repositories/events.repository';
import { CreateEventsDto } from '../dto/create-events.dto';
import { UpdateEventsDto } from '../dto/update-events.dto';
import { QueryEventsDto } from '../dto/query-events.dto';
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
   * Check if event is expired
   * Returns true if current date/time is past event end time
   */
  private isEventExpired(event: Events): boolean {
    const now = new Date();
    const eventDateTime = new Date(`${event.date.toISOString().split('T')[0]}T${event.endTime}`);
    return now > eventDateTime;
  }

  /**
   * Add isExpired property and update status if needed
   */
  private async addExpiredFlagAndUpdate(event: Events): Promise<Events & { isExpired: boolean }> {
    const isExpired = this.isEventExpired(event);
    
    // if event is expired and still published, update status to expired
    if (isExpired && event.status === EventStatus.PUBLISHED) {
      await this.eventsRepository.updateStatus(event.id, EventStatus.EXPIRED);
      event.status = EventStatus.EXPIRED;
    }
    
    return {
      ...event,
      isExpired
    };
  }

  /**
   * Add isExpired property and update status for multiple events
   */
  private async addExpiredFlagsAndUpdate(events: Events[]): Promise<(Events & { isExpired: boolean })[]> {
    const updatedEvents = [];
    
    for (const event of events) {
      const updatedEvent = await this.addExpiredFlagAndUpdate(event);
      updatedEvents.push(updatedEvent);
    }
    
    return updatedEvents;
  }



  /**
   * Create new event
   * Only admins can create events
  */
  async create(createEventsDto: CreateEventsDto, userId: string): Promise<Events> {
    // Check if event with same title already exists
    const existingEvent = await this.eventsRepository.findByTitle(createEventsDto.title);
    if (existingEvent) {
      throw new ConflictException('Event with this title already exists');
    }

    // Validate event date is in the future
    if (createEventsDto.date <= new Date()) {
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
    };

    return this.eventsRepository.create(eventData);
  }



  /**
   * Get all events (Admin only)
   * Returns all events regardless of status with isExpired flag
   */
  async findAll(): Promise<(Events & { isExpired: boolean })[]> {
    const events = await this.eventsRepository.findAll();
    return this.addExpiredFlagsAndUpdate(events);
  }


  /**
   * Get published events only with isExpired flag
   * Available for public booking
   */
  async findPublished(): Promise<(Events & { isExpired: boolean })[]> {
    const events = await this.eventsRepository.findPublished();
    return this.addExpiredFlagsAndUpdate(events);
  }



  /**
  * Find event by ID with isExpired flag
  * Returns event details with relations
  */
  async findOne(id: string): Promise<Events & { isExpired: boolean }> {
    const event = await this.eventsRepository.findById(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return this.addExpiredFlagAndUpdate(event);
  }



  /**
    * Get events created by specific user
    * Useful for admin dashboard
    */
  async findByCreator(userId: string): Promise<Events[]> {
    return this.eventsRepository.findByCreator(userId);
  }




  /**
   * Update event information
   * Only creator or admin can update
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
      if (existingEvent && existingEvent.id !== id) {
        throw new ConflictException('Event with this title already exists');
      }
    }

    // Validate date if being changed (date is already Date object from DTO)
    if (updateEventsDto.date && updateEventsDto.date <= new Date()) {
      throw new BadRequestException('Event date must be in the future');
    }

    // Validate capacity against current bookings
    if (updateEventsDto.maxCapacity !== undefined && updateEventsDto.maxCapacity < event.currentBookings) {
      throw new BadRequestException(
        `Cannot reduce capacity below current bookings (${event.currentBookings})`
      );
    }

    // No need for data transformation - DTO already has correct types
    return this.eventsRepository.update(id, updateEventsDto);
  }




  /**
  * Update event status
  * Publish, cancel, or draft events
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
  * Only if no confirmed bookings exist
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
  * Used before creating bookings
  */
  async hasAvailableSpots(id: string): Promise<boolean> {
    return this.eventsRepository.hasAvailableSpots(id);
  }

  /**
   * Get available spots count for published events only
   * Returns remaining capacity for public booking
   */
  async getAvailableSpots(id: string): Promise<number> {
    const event = await this.findOne(id);
    
    // Only show available spots for published events
    if (event.status !== EventStatus.PUBLISHED) {
      throw new BadRequestException('Event is not available for booking');
    }
    
    return this.eventsRepository.getAvailableSpots(id);
  }


  /**
  * Increment bookings count
  * Called when booking is confirmed
  */
  async incrementBookings(id: string): Promise<Events> {
    const event = await this.findOne(id);

    if (event.currentBookings >= event.maxCapacity) {
      throw new BadRequestException('Event is at full capacity');
    }

    return this.eventsRepository.incrementBookings(id);
  }

  /**
  * Decrement bookings count
  * Called when booking is canceled
  */
  async decrementBookings(id: string): Promise<Events> {
    const event = await this.findOne(id);

    if (event.currentBookings <= 0) {
      throw new BadRequestException('No bookings to cancel');
    }

    return this.eventsRepository.decrementBookings(id);
  }





  /**
  * Validate event for booking
  * Comprehensive check before allowing booking
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



  /**
  * Search events with filters and isExpired flags
  * Backend filtering for status and creator only
  */
  async findWithFilters(queryDto: QueryEventsDto): Promise<(Events & { isExpired: boolean })[]> {
    let events: Events[];

    // If both status and createdById are provided
    if (queryDto.createdById && queryDto.status) {
      const eventsByCreator = await this.eventsRepository.findByCreator(queryDto.createdById);
      events = eventsByCreator.filter(event => event.status === queryDto.status);
    }
    // Single filter cases
    else if (queryDto.status) {
      events = await this.eventsRepository.findByStatus(queryDto.status);
    }
    else if (queryDto.createdById) {
      events = await this.eventsRepository.findByCreator(queryDto.createdById);
    }
    else {
      events = await this.eventsRepository.findAll();
    }

    return this.addExpiredFlagsAndUpdate(events);
  }

  /**
   * Mark expired events as completed or expired
   * Should be called by cron job
   */
  async markExpiredEventsAsCompleted(): Promise<void> {
    const publishedEvents = await this.eventsRepository.findByStatus(EventStatus.PUBLISHED);
    
    for (const event of publishedEvents) {
      if (this.isEventExpired(event)) {
        // يمكن تغيير الحالة إلى EXPIRED أو COMPLETED حسب المطلوب
        await this.eventsRepository.updateStatus(event.id, EventStatus.EXPIRED);
      }
    }
  }


}
