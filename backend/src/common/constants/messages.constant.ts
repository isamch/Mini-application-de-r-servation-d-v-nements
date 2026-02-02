/**
* Application Messages
*
* @description
* Centralized message constants for consistent responses.
* Used in filters, interceptors, and throughout the application.
*/
export const APP_MESSAGES = {
// General success messages
SUCCESS: 'Operation completed successfully',
CREATED: 'Resource created successfully',
UPDATED: 'Resource updated successfully',
DELETED: 'Resource deleted successfully',

// General error messages
INTERNAL_SERVER_ERROR: 'Something went wrong. Please try again later',
BAD_REQUEST: 'Invalid request',
NOT_FOUND: 'Resource not found',
FORBIDDEN: 'You do not have permission to access this resource',
UNAUTHORIZED: 'Authentication required',

// Validation messages
VALIDATION_FAILED: 'Validation failed',
INVALID_INPUT: 'Invalid input data',
REQUIRED_FIELD: 'This field is required',
INVALID_EMAIL: 'Invalid email format',
INVALID_DATE: 'Invalid date format',

// Rate limiting
TOO_MANY_REQUESTS: 'Too many requests. Please try again later',

// Maintenance
MAINTENANCE_MODE: 'Application is under maintenance. Please try again later',
} as const;