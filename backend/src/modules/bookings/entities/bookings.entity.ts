// src/modules/bookings/entities/bookings.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Events } from '../../events/entities/events.entity';

/**
 * Booking Status Enum
 * Defines the possible states of a booking lifecycle
 */
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  REFUSED = 'refused',
  CANCELED = 'canceled',
}

/**
 * Bookings Entity
 * Database schema for the 'bookings' table
 */
@Entity('bookings')
export class Bookings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  eventId: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  cancelReason?: string;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Events)
  @JoinColumn({ name: 'eventId' })
  event: Events;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}