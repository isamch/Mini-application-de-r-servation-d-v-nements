import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './controllers/bookings.controller';
import { BookingsService } from './services/bookings.service';
import { BookingsRepository } from './repositories/bookings.repository';
import { Bookings } from './entities/bookings.entity';

/**
 * Bookings Module
 * Handles bookings related functionality and business logic
 */
@Module({
  imports: [TypeOrmModule.forFeature([Bookings])],
  controllers: [BookingsController],
  providers: [BookingsService, BookingsRepository],
  exports: [BookingsService, BookingsRepository],
})
export class BookingsModule {}
