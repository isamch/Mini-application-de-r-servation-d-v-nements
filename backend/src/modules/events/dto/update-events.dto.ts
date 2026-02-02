// src/modules/events/dto/update-events.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateEventsDto } from './create-events.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { EventStatus } from '../entities/events.entity';

/**
 * Update Events DTO
 * Data transfer object for updating existing events
 */
export class UpdateEventsDto extends PartialType(CreateEventsDto) {
  @ApiProperty({
    description: 'Event status for admin updates',
    enum: EventStatus,
    required: false
  })
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;
}
