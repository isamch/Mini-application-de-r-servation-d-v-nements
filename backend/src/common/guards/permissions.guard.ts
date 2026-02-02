import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
* Permissions Guard
*
* @description
* Generic guard for checking user permissions.
* Works with @RequirePermissions decorator.
*
* @example
* ```typescript
* @Controller('products')
* @UseGuards(PermissionsGuard)
* export class ProductsController {
* @Post()
* @RequirePermissions(ProductPermissions.CREATE)
* create() { ... }
* }
* ```
*/
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.permissions) {
      return false;
    }

    return requiredPermissions.some((permission) =>
      user.permissions.includes(permission),
    );
  }
}