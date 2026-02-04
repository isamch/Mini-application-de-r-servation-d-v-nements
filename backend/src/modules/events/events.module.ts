import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './controllers/events.controller';
import { EventsService } from './services/events.service';
import { EventsRepository } from './repositories/events.repository';
import { Events } from './entities/events.entity';
import { EventsAuditMiddleware } from './middlewares/events-audit.middleware';
import { AuditModule } from '../audit/audit.module';

/**
 * Events Module
 * Handles events related functionality and business logic
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Events]),
    AuditModule,
  ],
  controllers: [EventsController],
  providers: [EventsService, EventsRepository, EventsAuditMiddleware],
  exports: [EventsService, EventsRepository],
})
export class EventsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EventsAuditMiddleware)
      .forRoutes(EventsController);
  }
}
