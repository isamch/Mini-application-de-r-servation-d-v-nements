/**
 * Email Utility Functions
 *
 * @description
 * Helper functions for email validation and formatting.
 */
export class EmailUtil {
  /**
   * Validate email format
   */
  static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Normalize email (lowercase and trim)
   */
  static normalize(email: string): string {
    return email.toLowerCase().trim();
  }

  /**
   * Extract domain from email
   * Example: "user@example.com" -> "example.com"
   */
  static getDomain(email: string): string {
    return email.split('@')[1] || '';
  }

  /**
   * Extract username from email
   * Example: "user@example.com" -> "user"
   */
  static getUsername(email: string): string {
    return email.split('@')[0] || '';
  }

  /**
   * Mask email for privacy
   * Example: "john.doe@example.com" -> "j***e@example.com"
   */
  static mask(email: string): string {
    const [username, domain] = email.split('@');
    if (!username || !domain) return email;

    if (username.length <= 2) {
      return `${username[0]}***@${domain}`;
    }

    const firstChar = username[0];
    const lastChar = username[username.length - 1];
    return `${firstChar}***${lastChar}@${domain}`;
  }

  /**
   * Check if email is from a specific domain
   */
  static isFromDomain(email: string, domain: string): boolean {
    return this.getDomain(email).toLowerCase() === domain.toLowerCase();
  }

  /**
   * Generate a random email for testing
   */
  static generateRandom(domain: string = 'example.com'): string {
    const randomString = Math.random().toString(36).substring(2, 10);
    return `user_${randomString}@${domain}`;
  }
}