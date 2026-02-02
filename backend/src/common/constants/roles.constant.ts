/**
 * User Roles
 *
 * @description
 * Defines available user roles in the system.
 * Used in Guards and Decorators.
 */
export enum UserRole {
  ADMIN = 'admin',
  PARTICIPANT = 'participant',
}

/**
 * Roles Metadata Key
 *
 * @description
 * Key used to store roles in metadata.
 * Used in @Roles decorator and RolesGuard.
 */
export const ROLES_KEY = 'roles';