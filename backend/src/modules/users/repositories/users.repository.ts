import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '@/modules/users/entities/user.entity';

/**
 * Users Repository
 * Handles database operations for User entity with custom query methods
 */
@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  /**
   * Find user by unique ID
   * Returns user or null if not found
   */
  async findById(id: string): Promise<User | null> {
    return this.findOne({ where: { id } });
  }

  /**
   * Find user by email address
   * Includes password field for authentication purposes
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({
      where: { email },
      select: [
        'id', 
        'email', 
        'password', 
        'firstName', 
        'lastName', 
        'roles', 
        'isActive',
        'refreshToken',
        'isEmailVerified',
        'emailVerificationToken',
        'passwordResetToken',
        'passwordResetExpires',
        'createdAt', 
        'updatedAt'
      ]
    });
  }
}
