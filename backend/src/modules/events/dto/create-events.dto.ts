import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Create Events DTO
 * Data transfer object for creating new events
 */
export class CreateEventsDto {
  @ApiProperty({ description: 'Events name', example: 'Sample Events' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Events description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Active status', default: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
