/**
 * Bookings Permissions
 * Defines all available permissions for bookings module
 */
export enum BookingsPermissions {
  // Basic CRUD permissions
  CREATE_BOOKINGS = 'create:bookings',
  READ_BOOKINGS = 'read:bookings',
  UPDATE_BOOKINGS = 'update:bookings',
  DELETE_BOOKINGS = 'delete:bookings',
  
  // Advanced permissions
  MANAGE_BOOKINGS = 'manage:bookings',
  VIEW_ALL_BOOKINGS = 'view-all:bookings',
}

/**
 * Get all bookings permissions
 * Returns array of all available permissions
 */
export function getBookingsPermissions(): string[] {
  return Object.values(BookingsPermissions);
}

/**
 * Check if user has bookings permission
 * Returns true if user has specific or manage permission
 */
export function hasBookingsPermission(userPermissions: string[], permission: BookingsPermissions): boolean {
  return userPermissions.includes(permission) || userPermissions.includes(BookingsPermissions.MANAGE_BOOKINGS);
}
