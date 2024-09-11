import { AutoMap } from '@automapper/classes';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ nullable: true })
  createdBy?: string;

  @AutoMap()
  @CreateDateColumn({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @AutoMap()
  @UpdateDateColumn({
    nullable: true,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;

  @AutoMap()
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
