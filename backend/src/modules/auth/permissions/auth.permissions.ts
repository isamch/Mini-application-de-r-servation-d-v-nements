/**
* Auth Permissions
*
* @description
* Template for defining authentication-specific permissions.
*
* @example
* ```typescript
* @RequirePermissions(AuthPermissions.MANAGE_USERS)
* @Post('admin/users')
* createUser() { ... }
* ```
*/
export enum AuthPermissions {
// Authentication permissions
LOGIN = 'auth:login',
REGISTER = 'auth:register',
LOGOUT = 'auth:logout',

// Password management
CHANGE_PASSWORD = 'auth:change_password',
RESET_PASSWORD = 'auth:reset_password',

// TODO: Add more auth-specific permissions
}
