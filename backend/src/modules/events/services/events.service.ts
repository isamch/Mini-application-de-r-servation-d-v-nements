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
   * Returns all events regardless of status
   */
  async findAll(): Promise<Events[]> {
    return this.eventsRepository.findAll();
  }


  /**
   * Get published events only
   * Available for public booking
   */
  async findPublished(): Promise<Events[]> {
    return this.eventsRepository.findPublished();
  }



  /**
  * Find event by ID
  * Returns event details with relations
  */
  async findOne(id: string): Promise<Events> {
    const event = await this.eventsRepository.findById(id);
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
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
  * Search events with filters
  * Advanced filtering and search
  */
  async findWithFilters(queryDto: QueryEventsDto): Promise<Events[]> {
    // This will use repository methods based on filters
    if (queryDto.status) {
      return this.eventsRepository.findByStatus(queryDto.status);
    }

    if (queryDto.date) {
      return this.eventsRepository.findByDate(new Date(queryDto.date));
    }

    if (queryDto.createdById) {
      return this.eventsRepository.findByCreator(queryDto.createdById);
    }

    return this.eventsRepository.findAll();
  }


}
