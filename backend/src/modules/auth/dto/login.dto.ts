import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * Login DTO
 *
 * @description
 * Data Transfer Object for user login.
 * Validates email and password format.
 *
 * @validation
 * - email: Must be valid email format
 * - password: Minimum 6 characters
 *
 * @example
 * ```typescript
 * const loginDto: LoginDto = {
 *   email: 'john@example.com',
 *   password: 'password123'
 * };
 * ```
 */
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
