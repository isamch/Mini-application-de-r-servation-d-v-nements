import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsDate } from 'class-validator';

/**
* Update User DTO
*
* @description
* Data Transfer Object for updating an existing user.
* Extends CreateUserDto with all fields as optional plus additional update-specific fields.
*
* @example
* ```typescript
* const updateUserDto: UpdateUserDto = {
*   firstName: 'Jane',
*   phone: '+1234567890',
*   isActive: false,
*   refreshToken: 'new-token'
* };
* ```
*/
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsOptional()
  @IsString()
  emailVerificationToken?: string;

  @IsOptional()
  @IsString()
  passwordResetToken?: string;

  @IsOptional()
  @IsDate()
  passwordResetExpires?: Date;
}
