
import { IsString } from 'class-validator';

/**
* Verify Email DTO
*
* @description
* Verify email with token
*/
export class VerifyEmailDto {
  @IsString()
  token: string;
}
