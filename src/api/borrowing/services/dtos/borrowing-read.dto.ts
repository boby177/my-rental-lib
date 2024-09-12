import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Book } from 'src/api/book/entities/book.entity';
import { Member } from 'src/api/member/entities/member.entity';
import { BaseEntity } from 'src/common/base';

export class BorrowingReadDTO extends BaseEntity {
  @ApiProperty()
  @AutoMap()
  id: string;

  @ApiProperty()
  @AutoMap()
  code: string;

  @ApiProperty()
  @AutoMap()
  status: string;

  @ApiProperty()
  @AutoMap()
  borrowingDate: Date;

  @ApiProperty()
  @AutoMap()
  returnedDate: Date;

  @ApiProperty()
  @AutoMap()
  member: Member;

  @ApiProperty()
  @AutoMap()
  book: Book;
}
