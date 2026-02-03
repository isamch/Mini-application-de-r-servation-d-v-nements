import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './controllers/events.controller';
import { EventsService } from './services/events.service';
import { EventsRepository } from './repositories/events.repository';
import { Events } from './entities/events.entity';
// import { BookingsModule } from '../bookings/bookings.module';

/**
 * Events Module
 * Handles events related functionality and business logic
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Events]),
  ],
  controllers: [EventsController],
  providers: [EventsService, EventsRepository],
  exports: [EventsService, EventsRepository],
})
export class EventsModule { }
