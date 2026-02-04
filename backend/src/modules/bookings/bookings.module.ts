import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './controllers/bookings.controller';
import { BookingsService } from './services/bookings.service';
import { BookingsRepository } from './repositories/bookings.repository';
import { Bookings } from './entities/bookings.entity';
import { EventsModule } from '../events/events.module'; 
import { PdfModule } from '../pdf/pdf.module';
import { EmailModule } from '../email/email.module';
import { BookingsAuditMiddleware } from './middlewares/bookings-audit.middleware';
import { AuditModule } from '../audit/audit.module';


/**
 * Bookings Module
 * Handles bookings related functionality and business logic
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Bookings]),
    EventsModule,
    PdfModule,
    EmailModule,
    AuditModule
  ],
  controllers: [BookingsController],
  providers: [BookingsService, BookingsRepository, BookingsAuditMiddleware],
  exports: [BookingsService, BookingsRepository],
})
export class BookingsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BookingsAuditMiddleware)
      .forRoutes(BookingsController);
  }
}
