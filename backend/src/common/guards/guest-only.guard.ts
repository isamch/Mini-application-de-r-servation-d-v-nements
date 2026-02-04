import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_GUEST_ONLY_KEY } from '@/common/decorators/guest-only.decorator';

/**
 * GuestOnly Guard
 * Prevents authenticated users from accessing guest-only routes
 */
@Injectable()
export class GuestOnlyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isGuestOnly = this.reflector.getAllAndOverride<boolean>(IS_GUEST_ONLY_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isGuestOnly) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (token) {
      try {
        this.jwtService.verify(token);
        throw new ForbiddenException('Already logged in');
      } catch (error) {
        if (error instanceof ForbiddenException) {
          throw error;
        }
        // Token is invalid, allow access
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}