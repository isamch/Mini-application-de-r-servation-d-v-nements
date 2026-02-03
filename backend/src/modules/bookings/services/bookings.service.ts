import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { BookingsRepository } from '../repositories/bookings.repository';
import { EventsService } from '../../events/services/events.service';
import { CreateBookingsDto } from '../dto/create-bookings.dto';
import { UpdateBookingsDto } from '../dto/update-bookings.dto';
import { QueryBookingsDto } from '../dto/query-bookings.dto';
import { Bookings, BookingStatus } from '../entities/bookings.entity';
import { UserRole } from '../../../common/constants/roles.constant';

/**
 * Bookings Service
 * Handles bookings business logic and database operations
 */
@Injectable()
export class BookingsService {
  constructor(
    private readonly bookingsRepository: BookingsRepository,
    private readonly eventsService: EventsService,
  ) { }


  /**
   * Create new booking
   * Validates event and creates booking for participant
   */
  async create(createBookingsDto: CreateBookingsDto, userId: string): Promise<Bookings> {
    // Validate event is available for booking
    const event = await this.eventsService.validateForBooking(createBookingsDto.eventId);

    // Check for duplicate booking
    const existingBooking = await this.bookingsRepository.findUserBookingForEvent(
      userId,
      createBookingsDto.eventId
    );

    if (existingBooking) {
      throw new ConflictException('You have already booked this event');
    }

    // Create booking with PENDING status
    const bookingData = {
      ...createBookingsDto,
      userId,
      status: BookingStatus.PENDING,
    };

    const booking = await this.bookingsRepository.create(bookingData);

    // Increment event bookings count
    await this.eventsService.incrementBookings(createBookingsDto.eventId);

    return booking;
  }




  /**
   * Get current user's bookings
   * Returns user's personal bookings with event details
   */
  async findMyBookings(userId: string): Promise<Bookings[]> {
    return this.bookingsRepository.findByUser(userId);
  }



  /**
   * Find booking by ID
   * Returns booking details with relations
   */
  async findOne(id: string): Promise<Bookings> {
    const booking = await this.bookingsRepository.findById(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }




  /**
   * Cancel user's own booking
   * Only booking owner can cancel their booking
   */
  async cancelMyBooking(
    id: string,
    userId: string,
    cancelReason?: string
  ): Promise<Bookings> {
    const booking = await this.findOne(id);

    // Check ownership
    if (booking.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }

    // Check if cancellation is allowed
    if (booking.status === BookingStatus.CANCELED) {
      throw new BadRequestException('Booking is already canceled');
    }

    if (booking.status === BookingStatus.REFUSED) {
      throw new BadRequestException('Cannot cancel a refused booking');
    }

    // Update booking status
    const updateData = {
      status: BookingStatus.CANCELED,
      cancelReason: cancelReason || 'Canceled by user',
    };

    const updatedBooking = await this.bookingsRepository.update(id, updateData);

    // Decrement event bookings count only if it was confirmed
    if (booking.status === BookingStatus.CONFIRMED) {
      await this.eventsService.decrementBookings(booking.eventId);
    }

    return updatedBooking;
  }





  /**
   * Update booking notes
   * User can update their own booking notes
   */
  async updateMyBooking(
    id: string,
    userId: string,
    notes: string
  ): Promise<Bookings> {
    const booking = await this.findOne(id);

    // Check ownership
    if (booking.userId !== userId) {
      throw new ForbiddenException('You can only update your own bookings');
    }

    return this.bookingsRepository.update(id, { notes });
  }




  /**
   * Get all bookings with optional filters
   * Admin only - can see all bookings
   */
  async findAll(queryDto?: QueryBookingsDto): Promise<Bookings[]> {
    if (!queryDto || Object.keys(queryDto).length === 0) {
      return this.bookingsRepository.findAll();
    }

    // Apply filters
    if (queryDto.status) {
      return this.bookingsRepository.findByStatus(queryDto.status);
    }

    if (queryDto.eventId) {
      return this.bookingsRepository.findByEvent(queryDto.eventId);
    }

    if (queryDto.userId) {
      return this.bookingsRepository.findByUser(queryDto.userId);
    }

    return this.bookingsRepository.findAll();
  }




  /**
   * Get bookings for specific event
   * Shows all participants for an event
   */
  async findByEvent(eventId: string): Promise<Bookings[]> {
    // Validate event exists
    await this.eventsService.findOne(eventId);

    return this.bookingsRepository.findByEvent(eventId);
  }




  /**
   * Confirm a pending booking
   * Admin can confirm pending bookings
   */
  async confirmBooking(
    id: string,
    userId: string,
    userRole: UserRole
  ): Promise<Bookings> {
    // Check admin permissions
    if (userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can confirm bookings');
    }

    const booking = await this.findOne(id);

    // Get event details to check creator
    const event = await this.eventsService.findOne(booking.eventId);

    // Check if user is event creator
    if (event.createdById !== userId) {
      throw new ForbiddenException('You can only confirm bookings for events you created');
    }

    // Check if confirmation is allowed
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Only pending bookings can be confirmed');
    }

    // Validate event is still available
    await this.eventsService.validateForBooking(booking.eventId);

    return this.bookingsRepository.update(id, {
      status: BookingStatus.CONFIRMED
    });
  }




  /**
  * Refuse a pending booking
  * Admin can refuse bookings with reason
  */
  async refuseBooking(
    id: string,
    userId: string,
    userRole: UserRole,
    refuseReason: string
  ): Promise<Bookings> {
    // Check admin permissions
    if (userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can refuse bookings');
    }

    const booking = await this.findOne(id);

    // Get event details to check creator
    const event = await this.eventsService.findOne(booking.eventId);

    // Check if user is event creator
    if (event.createdById !== userId) {
      throw new ForbiddenException('You can only refuse bookings for events you created');
    }

    // Check if refusal is allowed
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Only pending bookings can be refused');
    }

    const updateData = {
      status: BookingStatus.REFUSED,
      cancelReason: refuseReason,
    };

    const updatedBooking = await this.bookingsRepository.update(id, updateData);

    // Decrement event bookings count
    await this.eventsService.decrementBookings(booking.eventId);

    return updatedBooking;
  }




  /**
   * Cancel any booking (Admin)
   * Admin can cancel any booking with reason
   */
  async cancelBooking(
    id: string,
    userId: string,
    userRole: UserRole,
    cancelReason: string
  ): Promise<Bookings> {
    // Check admin permissions
    if (userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can cancel bookings');
    }

    const booking = await this.findOne(id);

    // Get event details to check creator
    const event = await this.eventsService.findOne(booking.eventId);

    // Check if user is event creator
    if (event.createdById !== userId) {
      throw new ForbiddenException('You can only cancel bookings for events you created');
    }

    // Check if cancellation is allowed
    if (booking.status === BookingStatus.CANCELED) {
      throw new BadRequestException('Booking is already canceled');
    }

    if (booking.status === BookingStatus.REFUSED) {
      throw new BadRequestException('Cannot cancel a refused booking');
    }

    const updateData = {
      status: BookingStatus.CANCELED,
      cancelReason,
    };

    const updatedBooking = await this.bookingsRepository.update(id, updateData);

    // Decrement event bookings count if it was confirmed
    if (booking.status === BookingStatus.CONFIRMED) {
      await this.eventsService.decrementBookings(booking.eventId);
    }

    return updatedBooking;
  }




  /**
   * Check if user owns the booking
   * Helper method for permission checks
   */
  async validateBookingOwnership(
    bookingId: string,
    userId: string
  ): Promise<Bookings> {
    const booking = await this.findOne(bookingId);

    if (booking.userId !== userId) {
      throw new ForbiddenException('You can only access your own bookings');
    }

    return booking;
  }




  /**
   * Get booking statistics
   * Returns counts by status and other metrics
   */
  async getBookingStats(eventId?: string): Promise<any> {
    const stats = {
      total: 0,
      pending: 0,
      confirmed: 0,
      refused: 0,
      canceled: 0,
    };

    let bookings: Bookings[];

    if (eventId) {
      bookings = await this.bookingsRepository.findByEvent(eventId);
    } else {
      bookings = await this.bookingsRepository.findAll();
    }

    stats.total = bookings.length;
    stats.pending = bookings.filter(b => b.status === BookingStatus.PENDING).length;
    stats.confirmed = bookings.filter(b => b.status === BookingStatus.CONFIRMED).length;
    stats.refused = bookings.filter(b => b.status === BookingStatus.REFUSED).length;
    stats.canceled = bookings.filter(b => b.status === BookingStatus.CANCELED).length;

    return stats;
  }

  /**
   * Check if user can download ticket
   * Only confirmed bookings can download tickets
   */
  async canDownloadTicket(bookingId: string, userId: string): Promise<boolean> {
    const booking = await this.validateBookingOwnership(bookingId, userId);
    return booking.status === BookingStatus.CONFIRMED;
  }


}