import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GuestOnlyGuard } from '@/common/guards/guest-only.guard';
import { UsersModule } from '@/modules/users/users.module';
import { getJwtConfig } from '@/config/jwt.config';

/**
 * Authentication Module
 * Handles user authentication, registration, and JWT token management
 */
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: getJwtConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GuestOnlyGuard,
  ],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
