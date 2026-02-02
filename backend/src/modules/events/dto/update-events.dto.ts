import { PartialType } from '@nestjs/mapped-types';
import { CreateEventsDto } from './create-events.dto';

/**
 * Update Events DTO
 * Data transfer object for updating existing events
 */
export class UpdateEventsDto extends PartialType(CreateEventsDto) {}
