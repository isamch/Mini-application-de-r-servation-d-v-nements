import { Controller, Post, Body, Get, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from '@/modules/auth/services/auth.service';
import { LoginDto } from '@/modules/auth/dto/login.dto';
import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { Public } from '@/common/decorators/public.decorator';
import { GuestOnly } from '@/common/decorators/guest-only.decorator';
import { GuestOnlyGuard } from '@/common/guards/guest-only.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { RefreshTokenDto } from '@/modules/auth/dto/refresh-token.dto';
import { VerifyEmailDto } from '@/modules/auth/dto/verify-email.dto';
import { ResendVerificationDto } from '@/modules/auth/dto/resend-verification.dto';
import { ForgotPasswordDto } from '@/modules/auth/dto/forgot-password.dto';
import { ResetPasswordDto } from '@/modules/auth/dto/reset-password.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

/**
 * Authentication Controller
 * Handles user authentication, registration, and account management
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /**
   * Register a new user account
   * Creates user and sends verification email
   */
  @ApiOperation({ summary: 'Register a new user' })
  @UseGuards(GuestOnlyGuard)
  @GuestOnly()
  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * Authenticate user with email and password
   * Returns JWT tokens for authenticated user
   */
  @ApiOperation({ summary: 'Login user' })
  @UseGuards(GuestOnlyGuard)
  @GuestOnly()
  @Public()
  @HttpCode(200)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Verify user email address with token
   * Activates user account after email verification
   */
  @ApiOperation({ summary: 'Verify email' })
  @Public()
  @Post('verify-email')
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  /**
   * Resend email verification to user
   * Generates new token and sends verification email
   */
  @ApiOperation({ summary: 'Resend email verification' })
  @Public()
  @Post('resend-verification')
  resendVerification(@Body() resendVerificationDto: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(resendVerificationDto);
  }

  /**
   * Request password reset email
   * Sends password reset link to user email
   */
  @ApiOperation({ summary: 'Request password reset' })
  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  /**
   * Reset user password with token
   * Updates password using reset token from email
   */
  @ApiOperation({ summary: 'Reset password' })
  @Public()
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  /**
   * Resend password reset email
   * Generates new reset token and sends email
   */
  @ApiOperation({ summary: 'Resend password reset email' })
  @Public()
  @Post('resend-password-reset')
  resendPasswordReset(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.resendPasswordReset(forgotPasswordDto);
  }

  /**
   * Refresh JWT access token
   * Generates new access token using refresh token
   */
  @ApiOperation({ summary: 'Refresh tokens' })
  @Public()
  @Post('refresh')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  /**
   * Logout user and invalidate tokens
   * Clears refresh token from database
   */
  @ApiOperation({ summary: 'Logout user' })
  @ApiBearerAuth()
  @Post('logout')
  logout(@CurrentUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  /**
   * Get current user profile information
   * Returns authenticated user details
   */
  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return { user };
  }
}
