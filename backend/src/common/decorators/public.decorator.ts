import { SetMetadata } from '@nestjs/common';

/**
* Public Decorator
*
* @description
* Marks a route as public (no authentication required).
* Use this decorator to bypass JWT authentication guard.
*
* @example
* ```typescript
* @Public()
* @Get('health')
* healthCheck() {
* return { status: 'ok' };
* }
* ```
*
* @see JwtAuthGuard - This decorator is checked by the JWT guard
*/
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
