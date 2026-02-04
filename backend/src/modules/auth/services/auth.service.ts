import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/modules/users/services/users.service';
import { EmailService } from '@/modules/email/services/email.service';
import { LoginDto } from '@/modules/auth/dto/login.dto';
import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { HashUtil } from '@/common/utils/hash.util';
import { TokenUtil } from '@/common/utils/token.util';
import { UrlUtil } from '@/common/utils/url.util';
import { RefreshTokenDto } from '@/modules/auth/dto/refresh-token.dto';
import { VerifyEmailDto } from '@/modules/auth/dto/verify-email.dto';
import { ResendVerificationDto } from '@/modules/auth/dto/resend-verification.dto';
import { ForgotPasswordDto } from '@/modules/auth/dto/forgot-password.dto';
import { ResetPasswordDto } from '@/modules/auth/dto/reset-password.dto';

/**
 * Authentication Service
 * Handles user authentication, registration, and account management logic
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) { }



  /**
   * Register new user account
   * Creates user, sends verification email, and returns tokens
   */
  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    await this.sendVerificationEmail(user);
    return this.generateTokens(user.id, user.email);
  }

  /**
   * Authenticate user with credentials
   * Validates credentials and returns JWT tokens
   */
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user || !(await HashUtil.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    await this.usersService.ensureUserPermissions(user);

    const tokens = await this.generateTokens(user.id, user.email);
    
    // Return tokens with user data (excluding sensitive fields)
    const { password, refreshToken, emailVerificationToken, passwordResetToken, ...userWithoutSensitiveData } = user;
    
    return {
      ...tokens,
      user: userWithoutSensitiveData
    };
  }

  /**
   * Verify user email with token
   * Activates user account using verification token
   */
  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await this.usersService.findByVerificationToken(verifyEmailDto.token);
    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    await this.usersService.verifyEmail(user.id);
    return { message: 'Email verified successfully' };
  }

  /**
   * Resend email verification
   * Generates new token and sends verification email
   */
  async resendVerificationEmail(resendVerificationDto: ResendVerificationDto) {
    const user = await this.usersService.findByEmail(resendVerificationDto.email);
    if (!user) {
      return { message: 'If email exists, verification email has been sent' };
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    await this.sendVerificationEmail(user);
    return { message: 'If email exists, verification email has been sent' };
  }

  /**
   * Send password reset email
   * Generates reset token and sends reset link
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      return { message: 'If email exists, reset link has been sent' };
    }

    await this.sendPasswordResetEmail(user);
    return { message: 'If email exists, reset link has been sent' };
  }

  /**
   * Resend password reset email
   * Delegates to forgotPassword for consistency
   */
  async resendPasswordReset(forgotPasswordDto: ForgotPasswordDto) {
    return this.forgotPassword(forgotPasswordDto);
  }

  /**
   * Reset user password with token
   * Updates password using valid reset token
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByPasswordResetToken(resetPasswordDto.token);
    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    await this.usersService.updatePassword(user.id, resetPasswordDto.newPassword);
    await this.usersService.clearPasswordResetToken(user.id);

    return { message: 'Password reset successfully' };
  }

  /**
   * Refresh JWT access token
   * Validates refresh token and generates new tokens
   */
  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken);
      const user = await this.usersService.findOne(payload.sub);

      if (!user || !user.refreshToken || !(await HashUtil.compare(refreshTokenDto.refreshToken, user.refreshToken))) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user.id, user.email);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Logout user and clear tokens
   * Invalidates refresh token in database
   */
  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  }

  /**
   * Generate JWT access and refresh tokens
   * Creates signed tokens for user authentication
   */
  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.usersService.updateRefreshToken(userId, await HashUtil.hash(refreshToken));
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  /**
   * Send email verification to user
   * Generates token and sends verification email
   */
  private async sendVerificationEmail(user: any) {
    const verificationToken = TokenUtil.generateEmailVerificationToken();
    await this.usersService.updateVerificationToken(user.id, verificationToken);

    const verificationUrl = UrlUtil.buildEmailVerificationUrl(verificationToken);
    await this.emailService.sendWithTemplate(
      user.email,
      'Verify Your Email Address',
      'verify-email',
      {
        firstName: user.firstName,
        verificationUrl
      }
    );
  }

  /**
   * Send password reset email to user
   * Generates reset token and sends reset link
   */
  private async sendPasswordResetEmail(user: any) {
    const resetToken = TokenUtil.generatePasswordResetToken();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour
    await this.usersService.updatePasswordResetToken(user.id, resetToken, resetExpires);

    const resetUrl = UrlUtil.buildPasswordResetUrl(resetToken);
    await this.emailService.sendWithTemplate(
      user.email,
      'Reset Your Password',
      'reset-password',
      {
        firstName: user.firstName,
        resetUrl
      }
    );
  }
}
