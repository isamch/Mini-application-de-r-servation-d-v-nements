import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * AuditLog Entity
 * Database model for audit_logs table
 */
@Entity('audit_logs')
export class Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string;

  @Column()
  action: string;

  @Column()
  resource: string;

  @Column({ nullable: true })
  resourceId: string;

  @Column({ nullable: true })
  userEmail: string;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column('text', { nullable: true })
  changes: string;

  @Column()
  method: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  statusCode: number;

  @CreateDateColumn()
  createdAt: Date;
}
