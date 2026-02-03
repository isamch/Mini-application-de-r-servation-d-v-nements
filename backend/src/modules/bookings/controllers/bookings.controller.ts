import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  BadRequestException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { BookingsService } from '../services/bookings.service';
import { CreateBookingsDto } from '../dto/create-bookings.dto';
import { UpdateBookingsDto } from '../dto/update-bookings.dto';
import { QueryBookingsDto } from '../dto/query-bookings.dto';
import { Bookings, BookingStatus } from '../entities/bookings.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UserRole } from '../../../common/constants/roles.constant';

/**
 * Bookings Controller
 * Handles HTTP requests for bookings management operations
 */
@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }




  /**
   * Create new booking
   * Participants can book available events
   */
  @ApiOperation({ summary: 'Create new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully', type: Bookings })
  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createBookingsDto: CreateBookingsDto,
    @CurrentUser() user: any
  ): Promise<Bookings> {
    return this.bookingsService.create(createBookingsDto, user.id);
  }





  /**
   * Get all bookings with optional filters
   * Admin only - can see all bookings in system
   */
  @ApiOperation({ summary: 'Get all bookings (Admin only)' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully', type: [Bookings] })
  @ApiBearerAuth()
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(@Query() queryDto: QueryBookingsDto): Promise<Bookings[]> {
    return this.bookingsService.findAll(queryDto);
  }



  /**
   * Get current user's bookings
   * Shows user's personal booking history
   */
  @ApiOperation({ summary: 'Get my bookings' })
  @ApiResponse({ status: 200, description: 'User bookings retrieved', type: [Bookings] })
  @ApiBearerAuth()
  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMyBookings(@CurrentUser() user: any): Promise<Bookings[]> {
    return this.bookingsService.findMyBookings(user.id);
  }





  /**
   * Get booking statistics
   * Returns booking counts by status
   */
  @ApiOperation({ summary: 'Get booking statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiBearerAuth()
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getBookingStats(@Query('eventId') eventId?: string): Promise<any> {
    return this.bookingsService.getBookingStats(eventId);
  }


  /**
   * Get bookings for specific event
   * Shows all participants for an event
   */
  @ApiOperation({ summary: 'Get bookings for event' })
  @ApiResponse({ status: 200, description: 'Event bookings retrieved', type: [Bookings] })
  @ApiBearerAuth()
  @Get('event/:eventId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findByEvent(@Param('eventId') eventId: string): Promise<Bookings[]> {
    return this.bookingsService.findByEvent(eventId);
  }



  /**
   * Get booking by ID
   * Returns booking details with relations
   */
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking found', type: Bookings })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string): Promise<Bookings> {
    return this.bookingsService.findOne(id);
  }



  /**
   * Update booking notes
   * User can update their own booking notes
   */
  @ApiOperation({ summary: 'Update my booking notes' })
  @ApiResponse({ status: 200, description: 'Booking notes updated', type: Bookings })
  @ApiBearerAuth()
  @Patch(':id/notes')
  @UseGuards(JwtAuthGuard)
  updateMyBooking(
    @Param('id') id: string,
    @Body('notes') notes: string,
    @CurrentUser() user: any
  ): Promise<Bookings> {
    return this.bookingsService.updateMyBooking(id, user.id, notes);
  }


  /**
   * Cancel my own booking
   * User can cancel their own booking
   */
  @ApiOperation({ summary: 'Cancel my booking' })
  @ApiResponse({ status: 200, description: 'Booking canceled successfully', type: Bookings })
  @ApiBearerAuth()
  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancelMyBooking(
    @Param('id') id: string,
    @Body('cancelReason') cancelReason: string,
    @CurrentUser() user: any
  ): Promise<Bookings> {
    return this.bookingsService.cancelMyBooking(id, user.id, cancelReason);
  }


  /**
   * Confirm pending booking
   * Admin can confirm pending bookings
   */
  @ApiOperation({ summary: 'Confirm booking' })
  @ApiResponse({ status: 200, description: 'Booking confirmed successfully', type: Bookings })
  @ApiBearerAuth()
  @Patch(':id/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  confirmBooking(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<Bookings> {
    return this.bookingsService.confirmBooking(id, user.id, user.role);
  }




  /**
   * Refuse pending booking
   * Admin can refuse bookings with reason
   */
  @ApiOperation({ summary: 'Refuse booking' })
  @ApiResponse({ status: 200, description: 'Booking refused successfully', type: Bookings })
  @ApiBearerAuth()
  @Patch(':id/refuse')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  refuseBooking(
    @Param('id') id: string,
    @Body('refuseReason') refuseReason: string,
    @CurrentUser() user: any
  ): Promise<Bookings> {
    return this.bookingsService.refuseBooking(id, user.id, user.role, refuseReason);
  }




  /**
   * Cancel any booking (Admin)
   * Admin can cancel any booking with reason
   */
  @ApiOperation({ summary: 'Cancel booking (Admin)' })
  @ApiResponse({ status: 200, description: 'Booking canceled successfully', type: Bookings })
  @ApiBearerAuth()
  @Patch(':id/admin-cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  cancelBooking(
    @Param('id') id: string,
    @Body('cancelReason') cancelReason: string,
    @CurrentUser() user: any
  ): Promise<Bookings> {
    return this.bookingsService.cancelBooking(id, user.id, user.role, cancelReason);
  }



  /**
   * Check if user can download ticket
   * Only confirmed bookings can download tickets
   */
  @ApiOperation({ summary: 'Check ticket eligibility' })
  @ApiResponse({ status: 200, description: 'Ticket eligibility status' })
  @ApiBearerAuth()
  @Get(':id/ticket-eligibility')
  @UseGuards(JwtAuthGuard)
  async checkTicketEligibility(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<{ canDownload: boolean }> {
    const canDownload = await this.bookingsService.canDownloadTicket(id, user.id);
    return { canDownload };
  }



  /**
  * Download booking ticket
  * Only for confirmed bookings
  */
  @ApiOperation({ summary: 'Download booking ticket' })
  @ApiResponse({ status: 200, description: 'Ticket downloaded successfully' })
  @ApiBearerAuth()
  @Get(':id/ticket')
  @UseGuards(JwtAuthGuard)
  async downloadTicket(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<any> {
    // Check eligibility first
    const canDownload = await this.bookingsService.canDownloadTicket(id, user.id);
    if (!canDownload) {
      throw new BadRequestException('Ticket not available for this booking');
    }

    // TODO: Implement PDF generation
    return { message: 'PDF ticket generation will be implemented here' };
  }


}
