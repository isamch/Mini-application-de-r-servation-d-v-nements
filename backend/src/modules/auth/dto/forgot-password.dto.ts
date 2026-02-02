
import { IsEmail } from 'class-validator';

/**
* Forgot Password DTO
*
* @description
* Request password reset email
*/
export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}
