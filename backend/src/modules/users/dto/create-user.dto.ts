import { IsEmail, IsString, MinLength, IsOptional, IsArray, IsEnum, IsBoolean } from 'class-validator';
import { UserRole } from '../../../common/constants/roles.constant';

/**
* Create User DTO
*
* @description
* Data Transfer Object for creating a new user.
* Validates input data before creating a user.
*
* @validation
* - email: Must be valid email format
* - password: Minimum 6 characters
* - firstName: Required string
* - lastName: Required string
* - phone: Optional phone number
* - role: Optional user role (defaults to participant)
* - permissions: Optional array of permissions
* - isActive: Optional active status (defaults to true)
* - isEmailVerified: Optional email verification status (defaults to false)
*
* @example
* ```typescript
* const createUserDto: CreateUserDto = {
*   email: 'john@example.com',
*   password: 'password123',
*   firstName: 'John',
*   lastName: 'Doe',
*   phone: '+1234567890',
*   role: UserRole.PARTICIPANT
* };
* ```
*/
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;
}
