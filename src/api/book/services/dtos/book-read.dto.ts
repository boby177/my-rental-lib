import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Borrowing } from 'src/api/borrowing/entities/borrowing.entity';
import { BaseEntity } from 'src/common/base';

export class BookReadDTO extends BaseEntity {
  @ApiProperty()
  @AutoMap()
  id: string;

  @ApiProperty()
  @AutoMap()
  code: string;

  @ApiProperty()
  @AutoMap()
  title: string;

  @ApiProperty()
  @AutoMap()
  author: string;

  @ApiProperty()
  @AutoMap()
  stock: number;

  @ApiProperty()
  @AutoMap()
  borrowedBooks: Borrowing[];
}
