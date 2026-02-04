import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { AuditRepository } from '../repositories/audit.repository';
import { CreateAuditDto } from '../dto/create-audit.dto';
import { Audit } from '../entities/audit.entity';

/**
 * Audit Service
 * Handles audit logging business logic and database operations
 */
@Injectable()
export class AuditService {
  constructor(
    private readonly auditRepository: AuditRepository,
  ) {}

  /**
   * Create new audit log record
   * Saves audit information to database
   */
  async create(createAuditDto: CreateAuditDto): Promise<Audit> {
    return this.auditRepository.create(createAuditDto);
  }

  /**
   * Get all audit log records
   * Returns complete list of audit entries
   */
  async findAll(): Promise<Audit[]> {
    return this.auditRepository.findAll();
  }

  /**
   * Find audit logs by user ID
   * Returns audit logs for specific user
   */
  async findByUser(userId: string): Promise<Audit[]> {
    return this.auditRepository.findByUser(userId);
  }

  /**
   * Find audit logs by resource
   * Returns audit logs for specific resource type
   */
  async findByResource(resource: string): Promise<Audit[]> {
    return this.auditRepository.findByResource(resource);
  }

  /**
   * Find audit log by unique ID
   * Returns audit log details or throws not found exception
   */
  async findOne(id: string): Promise<Audit> {
    const audit = await this.auditRepository.findById(id);
    if (!audit) {
      throw new NotFoundException('Audit log not found');
    }
    return audit;
  }
}
