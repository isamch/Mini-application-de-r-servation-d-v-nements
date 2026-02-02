import {
PipeTransform,
Injectable,
ArgumentMetadata,
BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

/**
* Global Validation Pipe
*
* @description
* Validates DTOs using class-validator decorators.
* Applied automatically to all @Body(), @Query(), @Param() decorators.
*
* @workflow
* 1. Check if metatype needs validation
* 2. Convert plain object to class instance
* 3. Validate using class-validator
* 4. If errors → throw BadRequestException
* 5. If valid → return transformed object
*
* @example DTO:
* ```typescript
* export class RegisterDto {
* @IsEmail()
* email: string;
*
* @MinLength(8)
* password: string;
* }
* ```
*
* @example Controller:
* ```typescript
* @Post('register')
* register(@Body() dto: RegisterDto) {
* // ValidationPipe validates automatically
* // If invalid → 400 Bad Request
* }
* ```
*
* @example Error Response:
* ```json
* {
* "statusCode": 400,
* "message": "Validation failed",
* "errors": [
* "email must be an email",
* "password must be longer than or equal to 8 characters"
* ]
* }
* ```
*
* @see https://docs.nestjs.com/techniques/validation
*/
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
// 1. If no metatype or simple type → skip validation
  if (!metatype || !this.toValidate(metatype)) {
    return value;
  }

// 2. Convert plain object to class instance
    const object = plainToInstance(metatype, value);

// 3. Validate object
    const errors = await validate(object);

// 4. If errors → throw exception
  if (errors.length > 0) {
    const messages = errors.map((error) => {
    return Object.values(error.constraints || {}).join(', ');
});

    throw new BadRequestException({
    message: 'Validation failed',
    errors: messages,
});
  }

// 5. Return validated object
    return object;
}

/**
* Check if metatype needs validation
*
* @param metatype - The type to check
* @returns true if validation is needed
*/
private toValidate(metatype: Function): boolean {
const types: Function[] = [String, Boolean, Number, Array, Object];
return !types.includes(metatype);
}
}