import { IsEmail, IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

/**
* Update User DTO
*
* @description
* Data Transfer Object for updating an existing user.
* All fields are optional - only provided fields will be updated.
*
* @validation
* - email: Must be valid email format (if provided)
* - firstName: Must be string (if provided)
* - lastName: Must be string (if provided)
* - password: Must be string (if provided)
* - roles: Must be array of strings (if provided)
* - isActive: Must be boolean (if provided)
*
* @security
* - Password updates should use a separate endpoint
* - This DTO includes password field for service compatibility
*
* @example
* ```typescript
* const updateUserDto: UpdateUserDto = {
* firstName: 'Jane',
* isActive: false
* };
* ```
*/
export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
