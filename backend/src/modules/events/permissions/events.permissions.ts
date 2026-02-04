/**
 * Events Permissions
 * Defines all available permissions for events module
 */
export enum EventsPermissions {
  MANAGE_EVENTS = 'manage:events',
  CREATE_EVENTS = 'create:events',
  READ_EVENTS = 'read:events',
  UPDATE_EVENTS = 'update:events',
  DELETE_EVENTS = 'delete:events',
  VIEW_ALL_EVENTS = 'view-all:events',
  PUBLISH_EVENTS = 'publish:events',
}


/**
 * Get all events permissions
 * Returns array of all available permissions
 */
export function getEventsPermissions(): string[] {
  return Object.values(EventsPermissions);
}

/**
 * Check if user has events permission
 * Returns true if user has specific or manage permission
 */
export function hasEventsPermission(userPermissions: string[], permission: EventsPermissions): boolean {
  return userPermissions.includes(permission) || userPermissions.includes(EventsPermissions.MANAGE_EVENTS);
}
