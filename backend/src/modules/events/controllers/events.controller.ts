import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { EventsService } from '../services/events.service';
import { CreateEventsDto } from '../dto/create-events.dto';
import { UpdateEventsDto } from '../dto/update-events.dto';
import { QueryEventsDto } from '../dto/query-events.dto';
import { Events, EventStatus } from '../entities/events.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserRole } from '@/common/constants/roles.constant';
import { Public } from '@/common/decorators/public.decorator';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { RequirePermissions } from '@/common/decorators/require-permissions.decorator';
import { EventsPermissions } from './../permissions/events.permissions';


/**
 * Events Controller
 * Handles HTTP requests for events management operations
 */
@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }



  /**
   * Create new event
   * Only admins can create events
   */
  @ApiOperation({ summary: 'Create new event' })
  @ApiResponse({ status: 201, description: 'Event created successfully', type: Events })
  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @RequirePermissions(EventsPermissions.CREATE_EVENTS)
  create(
    @Body() createEventsDto: CreateEventsDto,
    @CurrentUser() user: any
  ): Promise<Events> {
    return this.eventsService.create(createEventsDto, user.id);
  }


  /**
   * Get all events with optional filters
   * Admin only - can see all events regardless of status
   */
  @ApiOperation({ summary: 'Get all events (Admin only)' })
  @ApiResponse({ status: 200, description: 'Events retrieved successfully', type: [Events] })
  @ApiBearerAuth()
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @RequirePermissions(EventsPermissions.VIEW_ALL_EVENTS)
  findAll(@Query() queryDto: QueryEventsDto): Promise<Events[]> {
    if (Object.keys(queryDto).length > 0) {
      return this.eventsService.findWithFilters(queryDto);
    }
    return this.eventsService.findAll();
  }




  /**
   * Get published events only
   * Available for public viewing and booking
   */
  @ApiOperation({ summary: 'Get published events' })
  @ApiResponse({ status: 200, description: 'Published events retrieved', type: [Events] })
  @Public()
  @Get('published')
  findPublished(@Query() queryDto: QueryEventsDto): Promise<Events[]> {
    // Filter only published events
    const publishedQuery = { ...queryDto, status: EventStatus.PUBLISHED };
    if (Object.keys(queryDto).length > 0) {
      return this.eventsService.findWithFilters(publishedQuery);
    }
    return this.eventsService.findPublished();
  }




  /**
   * Advanced search for events
   * Public endpoint with filtering capabilities
   */
  @ApiOperation({ summary: 'Search events with filters' })
  @ApiResponse({ status: 200, description: 'Search results', type: [Events] })
  @Public()
  @Get('search')
  search(@Query() queryDto: QueryEventsDto): Promise<Events[]> {
    return this.eventsService.findWithFilters(queryDto);
  }




  /**
   * Get events created by current user
   * Shows user's own events
   */
  @ApiOperation({ summary: 'Get my events' })
  @ApiResponse({ status: 200, description: 'User events retrieved', type: [Events] })
  @ApiBearerAuth()
  @Get('my')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(EventsPermissions.READ_EVENTS)
  findMyEvents(@CurrentUser() user: any): Promise<Events[]> {
    return this.eventsService.findByCreator(user.id);
  }




  /**
   * Get event by ID
   * Public endpoint for viewing event details
   */
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({ status: 200, description: 'Event found', type: Events })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Events> {
    return this.eventsService.findOne(id);
  }





  /**
   * Update event information
   * Only creator or admin can update
   */
  @ApiOperation({ summary: 'Update event' })
  @ApiResponse({ status: 200, description: 'Event updated successfully', type: Events })
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(EventsPermissions.UPDATE_EVENTS)
  update(
    @Param('id') id: string,
    @Body() updateEventsDto: UpdateEventsDto,
    @CurrentUser() user: any
  ): Promise<Events> {
    return this.eventsService.update(id, updateEventsDto, user.id, user.role);
  }



  /**
   * Update event status
   * Publish, cancel, or draft events
   */
  @ApiOperation({ summary: 'Update event status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully', type: Events })
  @ApiBearerAuth()
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(EventsPermissions.PUBLISH_EVENTS)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: EventStatus,
    @CurrentUser() user: any
  ): Promise<Events> {
    return this.eventsService.updateStatus(id, status, user.id, user.role);
  }



  /**
   * Delete event
   * Only creator or admin can delete
   */
  @ApiOperation({ summary: 'Delete event' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(EventsPermissions.DELETE_EVENTS)
  remove(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<void> {
    return this.eventsService.remove(id, user.id, user.role);
  }



  /**
   * Check available spots for event
   * Public endpoint for checking availability
   */
  @ApiOperation({ summary: 'Check available spots' })
  @ApiResponse({ status: 200, description: 'Available spots count' })
  @Public()
  @Get(':id/available-spots')
  getAvailableSpots(@Param('id') id: string): Promise<number> {
    return this.eventsService.getAvailableSpots(id);
  }



  /**
   * Validate event for booking
   * Internal endpoint used by booking system
   */
  @ApiOperation({ summary: 'Validate event for booking' })
  @ApiResponse({ status: 200, description: 'Event is valid for booking', type: Events })
  @ApiBearerAuth()
  @Get(':id/validate-booking')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(EventsPermissions.READ_EVENTS)
  validateForBooking(@Param('id') id: string): Promise<Events> {
    return this.eventsService.validateForBooking(id);
  }



}
