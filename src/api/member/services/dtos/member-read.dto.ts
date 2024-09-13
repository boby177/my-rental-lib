import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Borrowing } from 'src/api/borrowing/entities/borrowing.entity';
import { BaseEntity } from 'src/common/base';

export class MemberReadDTO extends BaseEntity {
  @ApiProperty()
  @AutoMap()
  id: string;

  @ApiProperty()
  @AutoMap()
  code: string;

  @ApiProperty()
  @AutoMap()
  name: string;

  @ApiProperty()
  @AutoMap()
  borrowedBooks: Borrowing[];
}
