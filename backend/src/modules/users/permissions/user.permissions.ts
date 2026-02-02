/**
  * User Permissions
  *
  * @description
  * Template for defining user-specific permissions.
  * Use these constants with guards or decorators for fine-grained access control.
  *
  * @example
  * ```typescript
  * // In guard:
  * if (!user.permissions.includes(UserPermissions.DELETE_USER)) {
  * throw new ForbiddenException();
  * }
  * ```
  *
  * @example With decorator:
  * ```typescript
  * @RequirePermissions(UserPermissions.UPDATE_USER)
  * @Patch(':id')
  * updateUser() { ... }
  * ```
  */
export enum UserPermissions {
  // Read permissions
  READ_USER = 'read:user',
  READ_ALL_USERS = 'read:all_users',

  // Write permissions
  CREATE_USER = 'create:user',
  UPDATE_USER = 'update:user',
  UPDATE_OWN_USER = 'update:own_user',

  // Delete permissions
  DELETE_USER = 'delete:user',
  DELETE_OWN_USER = 'delete:own_user',

  // TODO: Add more permissions as needed
}

/**
  * Permission Helper
  *
  * @description
  * Helper functions for working with permissions
  */
export class PermissionHelper {
  /**
  * Check if user has permission
  */
  static hasPermission(userPermissions: string[], required: UserPermissions): boolean {
    return userPermissions.includes(required);
  }

  /**
    * Check if user has any of the permissions
    */
  static hasAnyPermission(userPermissions: string[], required: UserPermissions[]): boolean {
    return required.some(permission => userPermissions.includes(permission));
  }

  /**
    * Check if user has all permissions
    */
  static hasAllPermissions(userPermissions: string[], required: UserPermissions[]): boolean {
    return required.every(permission => userPermissions.includes(permission));
  }
}
