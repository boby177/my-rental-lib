import { AutoMap } from '@automapper/classes';
import { Book } from 'src/api/book/entities/book.entity';
import { Member } from 'src/api/member/entities/member.entity';
import { BaseEntity } from 'src/common/base';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('borrowing')
export class Borrowing extends BaseEntity {
  @AutoMap()
  @Column({ type: 'varchar', unique: true })
  code: string;

  @AutoMap()
  @Column({ type: 'varchar', default: 'Borrowed' })
  status: string;

  @AutoMap()
  @Column({ type: 'date' })
  borrowingDate: Date;

  @AutoMap()
  @Column({ type: 'date', nullable: true })
  returnedDate: Date;

  // Relation M to 1 with Member table
  @AutoMap(() => [Member])
  @ManyToOne(() => Member, (member) => member.borrowedBooks, {
    onDelete: 'CASCADE',
  })
  member: Member;

  // Relation M to 1 with Book table
  @AutoMap(() => [Book])
  @ManyToOne(() => Book, (book) => book.borrowedBooks, {
    onDelete: 'CASCADE',
  })
  book: Book;
}
