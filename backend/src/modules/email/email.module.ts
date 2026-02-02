import { Module, Global } from '@nestjs/common';
import { EmailService } from './services/email.service';

/**
 * Email Module
 * Global module providing email functionality across the application
 */
@Global()
@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}