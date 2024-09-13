import { AutoMap } from '@automapper/classes';
import { Borrowing } from 'src/api/borrowing/entities/borrowing.entity';
import { BaseEntity } from 'src/common/base';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('member')
export class Member extends BaseEntity {
  @AutoMap()
  @Column({ type: 'varchar', unique: true })
  code: string;

  @AutoMap()
  @Column({ type: 'varchar' })
  name: string;

  @AutoMap()
  @Column({ type: 'boolean', default: false })
  isPenalized: boolean;

  // Relations 1 to M with Borrowing table
  @AutoMap(() => [Borrowing])
  @OneToMany(() => Borrowing, (borrowed) => borrowed.member, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  borrowedBooks: Borrowing[];
}
