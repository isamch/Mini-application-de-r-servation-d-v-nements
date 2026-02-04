import { SetMetadata } from '@nestjs/common';

/**
 * GuestOnly Decorator
 * Marks a route as accessible only to non-authenticated users (guests)
 */
export const IS_GUEST_ONLY_KEY = 'isGuestOnly';
export const GuestOnly = () => SetMetadata(IS_GUEST_ONLY_KEY, true);