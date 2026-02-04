import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Create Audit DTO
 * Data transfer object for creating new audit log
 */
export class CreateAuditDto {
  @ApiProperty({ description: 'User ID who performed the action', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ description: 'Action performed', example: 'CREATE_EVENT' })
  @IsString()
  action: string;

  @ApiProperty({ description: 'Resource type', example: 'events' })
  @IsString()
  resource: string;

  @ApiProperty({ description: 'Resource ID', required: false })
  @IsOptional()
  @IsString()
  resourceId?: string;

  @ApiProperty({ description: 'User email', required: false })
  @IsOptional()
  @IsString()
  userEmail?: string;

  @ApiProperty({ description: 'IP address', required: false })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({ description: 'User agent', required: false })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiProperty({ description: 'Changes made', required: false })
  @IsOptional()
  @IsString()
  changes?: string;

  @ApiProperty({ description: 'HTTP method', example: 'POST' })
  @IsString()
  method: string;

  @ApiProperty({ description: 'Request URL', example: '/api/events' })
  @IsString()
  url: string;

  @ApiProperty({ description: 'Response status code', required: false })
  @IsOptional()
  @IsNumber()
  statusCode?: number;
}