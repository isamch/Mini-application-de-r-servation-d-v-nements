import { IsEmail, IsString, MinLength, IsOptional, IsArray } from 'class-validator';

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
* - roles: Optional array of role names
*
* @example
* ```typescript
* const createUserDto: CreateUserDto = {
* email: 'john@example.com',
* password: 'password123',
* firstName: 'John',
* lastName: 'Doe',
* roles: ['user']
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
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}
