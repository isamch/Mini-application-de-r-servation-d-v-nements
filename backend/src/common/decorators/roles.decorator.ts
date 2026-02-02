import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '@/common/constants';

/**
 * Roles Decorator
 *
 * @description
 * Assigns required roles to a route.
 * Works with RolesGuard to restrict access.
 *
 * @param roles - Array of role strings
 *
 * @example
 * ```typescript
 * @Roles('admin', 'moderator')
 * @Get('users')
 * findAll() {
 *   // Only admin and moderator can access
 * }
 * ```
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
