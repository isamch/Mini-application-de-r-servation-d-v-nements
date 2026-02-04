import { IsEmail, IsString, MinLength, Matches, IsOptional } from 'class-validator';
import { REGEX_PATTERNS } from '@/common/constants';

/**
 * Register DTO
 *
 * @description
 * Data Transfer Object for user registration.
 * Validates all required fields for creating a new account.
 *
 * @validation
 * - email: Must be valid email format
 * - password: Minimum 8 characters, uppercase, lowercase, number
 * - firstName: Required string
 * - lastName: Required string
 * - phone: Optional string
 *
 * @example
 * ```typescript
 * const registerDto: RegisterDto = {
 *   email: 'john@example.com',
 *   password: 'Password123',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   phone: '+1234567890'
 * };
 * ```
 */
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(REGEX_PATTERNS.PASSWORD, {
  message: 'Password must contain at least 8 characters, one uppercase, one lowercase, and one number',
  })
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
