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



  

}
