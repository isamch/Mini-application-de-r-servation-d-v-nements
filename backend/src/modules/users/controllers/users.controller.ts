import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from '@/modules/users/services/users.service';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@/modules/users/entities/user.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

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
  @ApiBearerAuth()
  @Post()
  @Roles('admin')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Get all users list
   * Admin only - returns paginated list of all users
   */
  @ApiOperation({ summary: 'Get all users' })
  @ApiBearerAuth()
  @Get()
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Get current user profile
   * Returns authenticated user's own profile information
   */
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth()
  @Get('me')
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  /**
   * Get specific user by ID
   * Admin only - returns user details by ID
   */
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiBearerAuth()
  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Update user information
   * Admin only - updates user details by ID
   */
  @ApiOperation({ summary: 'Update user' })
  @ApiBearerAuth()
  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Delete user account
   * Admin only - permanently removes user by ID
   */
  @ApiOperation({ summary: 'Delete user' })
  @ApiBearerAuth()
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
