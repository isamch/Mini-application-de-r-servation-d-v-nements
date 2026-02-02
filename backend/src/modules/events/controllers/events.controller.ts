import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { CreateEventsDto } from '../dto/create-events.dto';
import { UpdateEventsDto } from '../dto/update-events.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

/**
 * Events Controller
 * Handles HTTP requests for events management operations
 */
@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * Create new events
   * Creates a new events record with provided data
   */
  @ApiOperation({ summary: 'Create new events' })
  @ApiBearerAuth()
  @Post()
  create(@Body() createEventsDto: CreateEventsDto) {
    return this.eventsService.create(createEventsDto);
  }

  /**
   * Get all events records
   * Returns paginated list of all events entries
   */
  @ApiOperation({ summary: 'Get all events' })
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  /**
   * Get events by ID
   * Returns specific events details by unique identifier
   */
  @ApiOperation({ summary: 'Get events by ID' })
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  /**
   * Update events information
   * Updates existing events with provided data
   */
  @ApiOperation({ summary: 'Update events' })
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventsDto: UpdateEventsDto) {
    return this.eventsService.update(id, updateEventsDto);
  }

  /**
   * Delete events record
   * Permanently removes events from database
   */
  @ApiOperation({ summary: 'Delete events' })
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
