import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '@/modules/users/services/users.service';

/**
* JWT Strategy
*
* @description
* Passport strategy for JWT authentication.
* Validates JWT tokens and attaches user to request.
*
* @workflow
* 1. Extract JWT from Authorization header
* 2. Verify token signature with secret
* 3. Extract payload (user ID, email)
* 4. Load user from database
* 5. Attach user to request object
*
* @example Token format:
* ```
* Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
* ```
*
* @see https://docs.nestjs.com/security/authentication
*/
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
  super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
});
  }

/**
* Validate JWT payload
*
* @param payload - Decoded JWT payload
* @returns User object (attached to request)
* @throws UnauthorizedException if user not found
*/
  async validate(payload: any) {
    const user = await this.usersService.findOne(payload.sub);

  if (!user) {
    throw new UnauthorizedException('User not found');
  }
  if (!user.isActive) {
    throw new UnauthorizedException('User account is inactive');
  }

    return user;
}
}
