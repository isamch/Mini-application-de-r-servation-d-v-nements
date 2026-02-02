
import { IsString, MinLength } from 'class-validator';

/**
* Reset Password DTO
*
* @description
* Reset password with token
*/
export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
