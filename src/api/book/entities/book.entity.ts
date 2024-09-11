import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/common/base';
import { Column, Entity } from 'typeorm';

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

  // TODO: Relation with borrowing table
}
