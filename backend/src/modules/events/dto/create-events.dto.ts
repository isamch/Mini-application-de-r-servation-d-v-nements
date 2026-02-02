import { IsString, IsNotEmpty, IsDateString, IsNumber, IsEnum, IsOptional, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventStatus } from '../entities/events.entity';

/**
 * Create Events DTO
 * Data transfer object for creating new events
 */
export class CreateEventsDto {
  @ApiProperty({
    description: 'Event title',
    example: 'Web Development Workshop',
    maxLength: 200
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Event description',
    example: 'Learn modern web development with React and Node.js'
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Event date',
    example: '2024-12-25'
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Event start time',
    example: '09:00'
  })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({
    description: 'Event end time',
    example: '17:00'
  })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({
    description: 'Event location',
    example: 'Conference Room A, Building 1'
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    description: 'Maximum number of participants',
    example: 50,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  maxCapacity: number;

  @ApiProperty({
    description: 'Event status',
    enum: EventStatus,
    default: EventStatus.DRAFT,
    required: false
  })
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;
}
