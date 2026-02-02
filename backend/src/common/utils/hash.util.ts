import * as bcrypt from 'bcrypt';

/**
 * Hash Utility
 * Provides secure password hashing and comparison using bcrypt
 */
const SALT_ROUNDS = 10;

export class HashUtil {
  /**
   * Hash a plain text password
   * Uses bcrypt with 10 salt rounds for security
   */
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Compare plain text password with hashed password
   * Returns true if passwords match, false otherwise
   */
  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
