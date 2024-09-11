import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/common/base';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity('member')
export class Extracurricular extends BaseEntity {
  @AutoMap()
  @Column({ type: 'varchar' })
  code: string;

  @AutoMap()
  @Column({ type: 'varchar' })
  name: string;

  @AutoMap()
  @Column({ type: 'boolean' })
  isPenalized: boolean;

  // TODO: Relation with borrowing table
}
