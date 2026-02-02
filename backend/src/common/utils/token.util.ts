import * as crypto from 'crypto';

/**
 * Token Utility
 * Provides secure token generation for various authentication purposes
 */
export class TokenUtil {
  /**
   * Generate a secure random token
   * Creates cryptographically secure random token of specified length
   */
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate email verification token
   * Creates 64-character hex token for email verification
   */
  static generateEmailVerificationToken(): string {
    return this.generateSecureToken(32);
  }

  /**
   * Generate password reset token
   * Creates 64-character hex token for password reset
   */
  static generatePasswordResetToken(): string {
    return this.generateSecureToken(32);
  }

  /**
   * Generate API key
   * Creates 80-character hex token for API authentication
   */
  static generateApiKey(): string {
    return this.generateSecureToken(40);
  }

  /**
   * Generate short numeric code
   * Creates numeric code for SMS verification or similar
   */
  static generateShortCode(length: number = 6): string {
    const chars = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}