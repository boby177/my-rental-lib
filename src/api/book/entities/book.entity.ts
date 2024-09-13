import { AutoMap } from '@automapper/classes';
import { Borrowing } from 'src/api/borrowing/entities/borrowing.entity';
import { BaseEntity } from 'src/common/base';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('book')
export class Book extends BaseEntity {
  @AutoMap()
  @Column({ type: 'varchar', unique: true })
  code: string;

  @AutoMap()
  @Column({ type: 'varchar' })
  title: string;

  @AutoMap()
  @Column({ type: 'varchar' })
  author: string;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  stock: number;

  // Relations 1 to M with Borrowing table
  @AutoMap(() => [Borrowing])
  @OneToMany(() => Borrowing, (borrowed) => borrowed.book, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  borrowedBooks: Borrowing[];
}
