import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';

/**
* JWT Auth Guard
*
* @description
* Global guard for JWT authentication.
* Protects all routes by default, unless marked with @Public() decorator.
*
* @workflow
* 1. Check if route is marked as @Public()
* 2. If public → Allow access
* 3. If protected → Validate JWT token
* 4. If valid → Attach user to request
* 5. If invalid → Return 401 Unauthorized
*
* @example Usage:
* ```typescript
* // Protected route (default)
* @Get('profile')
* getProfile(@CurrentUser() user: User) {
* return user;
* }
*
* // Public route
* @Public()
* @Get('health')
* healthCheck() {
* return { status: 'ok' };
* }
* ```
*
* @see JwtStrategy
* @see Public decorator
*/
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
  super();
  }
  canActivate(context: ExecutionContext) {
// Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);

  if (isPublic) {
    return true;
  }

  // Validate JWT
    return super.canActivate(context);
}
}
  