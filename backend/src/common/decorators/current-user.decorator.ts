import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * CurrentUser Decorator
 *
 * @description
 * Extracts the authenticated user from the request object.
 * The user is attached to the request by the JWT strategy after successful authentication.
 *
 * @example
 * ```typescript
 * @Get('profile')
 * getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 * ```
 *
 * @example With specific property
 * ```typescript
 * @Get('my-posts')
 * getMyPosts(@CurrentUser('id') userId: string) {
 *   return this.postsService.findByUserId(userId);
 * }
 * ```
 *
 * @see JwtStrategy - Attaches user to request
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    
    return data ? user?.[data] : user;
  },
);
