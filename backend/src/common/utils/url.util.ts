/**
 * URL Utility
 * Provides URL building functions for application links and redirects
 */
export class UrlUtil {
  /**
   * Get base application URL
   * Returns configured app URL or localhost default
   */
  static getAppUrl(): string {
    return process.env.APP_URL || 'http://localhost:3000';
  }

  /**
   * Build email verification URL
   * Creates complete URL for email verification with token
   */
  static buildEmailVerificationUrl(token: string): string {
    return `${this.getAppUrl()}/auth/verify-email?token=${token}`;
  }

  /**
   * Build password reset URL
   * Creates complete URL for password reset with token
   */
  static buildPasswordResetUrl(token: string): string {
    return `${this.getAppUrl()}/auth/reset-password?token=${token}`;
  }

  /**
   * Build user profile URL
   * Creates URL for user profile page
   */
  static buildUserProfileUrl(userId: string): string {
    return `${this.getAppUrl()}/users/${userId}`;
  }

  /**
   * Build generic URL with query parameters
   * Creates URL with path and optional query parameters
   */
  static buildUrl(path: string, params: Record<string, string> = {}): string {
    const baseUrl = `${this.getAppUrl()}${path}`;
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }
}