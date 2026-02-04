/**
 * Audit Permissions
 * Defines all available permissions for audit module
 */
export enum AuditPermissions {
  // Basic audit permissions
  READ_AUDIT = 'read:audit',
  VIEW_ALL_AUDIT = 'view-all:audit',
  MANAGE_AUDIT = 'manage:audit',
}

/**
 * Get all audit permissions
 * Returns array of all available permissions
 */
export function getAuditPermissions(): string[] {
  return Object.values(AuditPermissions);
}

/**
 * Check if user has audit permission
 * Returns true if user has specific or manage permission
 */
export function hasAuditPermission(userPermissions: string[], permission: AuditPermissions): boolean {
  return userPermissions.includes(permission) || userPermissions.includes(AuditPermissions.MANAGE_AUDIT);
}
