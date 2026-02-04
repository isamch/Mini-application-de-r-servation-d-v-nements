import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UsersRepository } from './repositories/users.repository';
import { User } from './entities/user.entity';
import { UserAuditMiddleware } from './middlewares/user-audit.middleware';
import { AuditModule } from '../audit/audit.module';

/**
 * Users Module
 * Handles user management functionality and CRUD operations
 */
@Module({
  imports: [TypeOrmModule.forFeature([User]), AuditModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserAuditMiddleware],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserAuditMiddleware)
      .forRoutes(UsersController);
  }
}
