
import { IsString } from 'class-validator';

/**
* Refresh Token DTO
*
* @description
* Data Transfer Object for refreshing access tokens.
*
* @example
* ```typescript
* const refreshDto: RefreshTokenDto = {
* refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
* };
* ```
*/
export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}
