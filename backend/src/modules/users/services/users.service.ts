import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UsersRepository } from '@/modules/users/repositories/users.repository';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { User } from '@/modules/users/entities/user.entity';
import { HashUtil } from '@/common/utils/hash.util';

/**
 * Users Service
 * Handles user management business logic and database operations
 */
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) { }

  /**
   * Create new user account
   * Validates email uniqueness and hashes password
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await HashUtil.hash(createUserDto.password);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  /**
   * Get all users from database
   * Returns complete list of all registered users
   */
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Find user by unique ID
   * Returns user details or throws not found exception
   */
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Find user by email address
   * Returns user or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  /**
   * Update user information
   * Validates email uniqueness and hashes password if provided
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await HashUtil.hash(updateUserDto.password);
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  /**
   * Delete user account
   * Permanently removes user from database
   */
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  /**
   * Update user refresh token
   * Stores hashed refresh token for authentication
   */
  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    await this.usersRepository.update(userId, { refreshToken: refreshToken || undefined });
  }

  /**
   * Update email verification token
   * Stores token for email verification process
   */
  async updateVerificationToken(userId: string, token: string): Promise<void> {
    await this.usersRepository.update(userId, { emailVerificationToken: token });
  }

  /**
   * Find user by verification token
   * Returns user with matching verification token
   */
  async findByVerificationToken(token: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { emailVerificationToken: token } });
  }

  /**
   * Mark user email as verified
   * Updates verification status and clears token
   */
  async verifyEmail(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      isEmailVerified: true,
      emailVerificationToken: undefined,
    });
  }

  /**
   * Update password reset token
   * Stores token and expiration for password reset
   */
  async updatePasswordResetToken(userId: string, token: string, expires: Date): Promise<void> {
    await this.usersRepository.update(userId, {
      passwordResetToken: token,
      passwordResetExpires: expires,
    });
  }

  /**
   * Find user by password reset token
   * Returns user with matching reset token
   */
  async findByPasswordResetToken(token: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { passwordResetToken: token } });
  }

  /**
   * Update user password
   * Hashes and stores new password
   */
  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await HashUtil.hash(newPassword);
    await this.usersRepository.update(userId, { password: hashedPassword });
  }

  /**
   * Clear password reset token
   * Removes reset token and expiration after use
   */
  async clearPasswordResetToken(userId: string): Promise<void> {
    await this.usersRepository.update(userId, {
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
    });
  }







  // permission related functions will be added here in the future

  /**
   * Generate default permissions for admin users
   * Returns array of all admin permissions
   */
  generateAdminPermissions(): string[] {
    return [
      // Events permissions
      'manage:events',
      'create:events',
      'read:events',
      'update:events',
      'delete:events',
      'view-all:events',
      'publish:events',

      // Bookings permissions
      'manage:bookings',
      'create:bookings',
      'read:bookings',
      'update:bookings',
      'delete:bookings',
      'view-all:bookings',
      'confirm:bookings',
      'refuse:bookings',

      // Users permissions
      'create:user',
      'read:all_users',
      'update:user',
      'delete:user'
    ];
  }

  /**
   * Generate default permissions for regular users
   * Returns array of basic user permissions
   */
  generateUserPermissions(): string[] {
    return [
      // Basic booking permissions
      'create:bookings',
      'read:bookings',
      'update:bookings',

      // Basic events permissions
      'read:events',

      // Own profile permissions
      'update:own_user',
      'read:user'
    ];
  }

  /**
   * Generate permissions based on user role
   * Returns appropriate permissions array for the role
   */
  generatePermissionsByRole(role: string): string[] {
    switch (role) {
      case 'ADMIN':
        return this.generateAdminPermissions();
      case 'PARTICIPANT':
      default:
        return this.generateUserPermissions();
    }
  }

  /**
   * Update user permissions
   * Updates the permissions array for a specific user
   */
  async updatePermissions(userId: string, permissions: string[]): Promise<void> {
    await this.usersRepository.update(userId, { permissions });
  }

  /**
   * Ensure user has correct permissions based on their role
   * Updates permissions if missing or outdated
   */
  async ensureUserPermissions(user: any): Promise<void> {
    const expectedPermissions = this.generatePermissionsByRole(user.role);

    if (!user.permissions || !this.arePermissionsUpToDate(user.permissions, expectedPermissions)) {
      await this.updatePermissions(user.id, expectedPermissions);
    }
  }

  /**
   * Check if user permissions are up to date
   * Compares current permissions with expected permissions
   */
  private arePermissionsUpToDate(currentPermissions: string[], expectedPermissions: string[]): boolean {
    if (currentPermissions.length !== expectedPermissions.length) {
      return false;
    }

    return expectedPermissions.every(permission =>
      currentPermissions.includes(permission)
    );
  }

}
