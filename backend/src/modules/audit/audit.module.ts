import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditService } from './services/audit.service';
import { AuditRepository } from './repositories/audit.repository';
import { Audit } from './entities/audit.entity';

/**
 * Audit Module
 * Handles audit logging functionality and business logic
 */
@Module({
  imports: [TypeOrmModule.forFeature([Audit])],
  providers: [AuditService, AuditRepository],
  exports: [AuditService, AuditRepository],
})
export class AuditModule {}
