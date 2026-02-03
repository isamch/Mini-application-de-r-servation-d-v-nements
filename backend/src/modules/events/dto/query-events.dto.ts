import { IsOptional, IsEnum, IsDateString, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { EventStatus } from '../entities/events.entity';

/**
 * Query Events DTO
 * Data transfer object for filtering and searching events
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
    description: 'Filter by specific date',
    example: '2024-12-25',
    required: false
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({
    description: 'Filter by event creator',
    example: 'uuid-user-id',
    required: false
  })
  @IsOptional()
  @IsString()
  createdById?: string;

  @ApiProperty({
    description: 'Search in title and description',
    example: 'workshop',
    required: false
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by location',
    example: 'conference room',
    required: false
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Show only events with available spots',
    example: true,
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  available?: boolean;

  @ApiProperty({
    description: 'Start date for date range filter',
    example: '2024-12-01',
    required: false
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'End date for date range filter',
    example: '2024-12-31',
    required: false
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
