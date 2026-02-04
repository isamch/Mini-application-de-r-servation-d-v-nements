import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '@/modules/users/services/users.service';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/modules/users/entities/user.entity';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { RequirePermissions } from '@/common/decorators/require-permissions.decorator';
import { UserPermissions } from './../permissions/user.permissions';
import { UserRole } from '@/common/constants/roles.constant';

/**
 * Users Controller
 * Handles user management operations and profile access
 */
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /**
   * Create new user account
   * Admin only - creates user with specified details
   */
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: User })
  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @RequirePermissions(UserPermissions.CREATE_USER)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  /**
   * Get all users list
   * Admin only - returns paginated list of all users
   */
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully', type: [User] })
  @ApiBearerAuth()
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @RequirePermissions(UserPermissions.READ_ALL_USERS)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
   * Get current user profile
   * Returns authenticated user's own profile information
   */
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: User })
  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(UserPermissions.READ_USER)
  getProfile(@CurrentUser() user: User): User {
    return user;
  }

  /**
   * Update current user profile
   * User can update their own profile information
   */
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully', type: User })
  @ApiBearerAuth()
  @Patch('me')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(UserPermissions.UPDATE_OWN_USER)
  updateProfile(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.update(user.id, updateUserDto);
  }

  /**
   * Get specific user by ID
   * Admin only - returns user details by ID
   */
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @RequirePermissions(UserPermissions.READ_ALL_USERS)
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  /**
   * Update user information
   * Admin only - updates user details by ID
   */
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: User })
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @RequirePermissions(UserPermissions.UPDATE_USER)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Delete user account
   * Admin only - permanently removes user by ID
   */
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @RequirePermissions(UserPermissions.DELETE_USER)
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
