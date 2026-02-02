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

  

  

}
