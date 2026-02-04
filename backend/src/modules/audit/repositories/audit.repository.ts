import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Audit } from '../entities/audit.entity';

/**
 * Audit Repository
 * Handles database operations for Audit entity
 */
@Injectable()
export class AuditRepository {
  constructor(
    @InjectRepository(Audit)
    private readonly repository: Repository<Audit>,
  ) {}

  /**
   * Create new audit log record
   * Saves new entity to database
   */
  async create(data: Partial<Audit>): Promise<Audit> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  /**
   * Get all audit log records
   * Returns all entities from database
   */
  async findAll(): Promise<Audit[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Find audit log by unique ID
   * Returns entity or null if not found
   */
  async findById(id: string): Promise<Audit | null> {
    return this.repository.findOne({ where: { id } });
  }

  /**
   * Find audit logs by user ID
   * Returns all audit logs for specific user
   */
  async findByUser(userId: string): Promise<Audit[]> {
    return this.repository.find({ 
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Find audit logs by resource type
   * Returns all audit logs for specific resource
   */
  async findByResource(resource: string): Promise<Audit[]> {
    return this.repository.find({ 
      where: { resource },
      order: { createdAt: 'DESC' }
    });
  }

  /**
   * Find audit logs by resource ID
   * Returns all audit logs for specific resource instance
   */
  async findByResourceId(resourceId: string): Promise<Audit[]> {
    return this.repository.find({ 
      where: { resourceId },
      order: { createdAt: 'DESC' }
    });
  }
}
