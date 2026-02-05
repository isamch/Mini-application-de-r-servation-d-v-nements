import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventStatus } from '../entities/events.entity';

/**
 * Query Events DTO
 * Data transfer object for filtering events (backend only)
 */
export class QueryEventsDto {
  @ApiProperty({
    description: 'Filter by event status',
    enum: EventStatus,
    example: EventStatus.PUBLISHED,
    required: false
  })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @ApiProperty({
    description: 'Filter by event creator',
    example: 'uuid-user-id',
    required: false
  })
  @IsOptional()
  @IsString()
  createdById?: string;
}
