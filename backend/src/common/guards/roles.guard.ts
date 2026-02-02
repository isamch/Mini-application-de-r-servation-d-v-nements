import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@/common/constants';

/**
 * Roles Guard
 *
 * @description
 * Checks if user has required roles to access a route.
 * Works with @Roles decorator.
 *
 * @example
 * ```typescript
 * // In app.module.ts or controller
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles('admin')
 * @Get('admin-only')
 * adminRoute() { ... }
 * ```
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
    ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

  if (!requiredRoles) {
    return true;
  }

    const { user } = context.switchToHttp().getRequest();

  if (!user) {
    return false;
  }

    return requiredRoles.some((role) => user.roles?.includes(role));
}
}
