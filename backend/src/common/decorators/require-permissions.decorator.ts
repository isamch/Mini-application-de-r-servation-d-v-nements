import { SetMetadata } from '@nestjs/common';

/**
* Require Permissions Decorator
*
* @description
* Decorator to specify required permissions for a route.
* Works with PermissionsGuard.
*
* @param permissions - Array of permission strings
*
* @example
* ```typescript
* @Post()
* @RequirePermissions(ProductPermissions.CREATE, ProductPermissions.MANAGE)
* create() {
* // Only users with CREATE or MANAGE permission can access
* }
* ```
*/
export const RequirePermissions = (...permissions: string[]) =>
SetMetadata('permissions', permissions);