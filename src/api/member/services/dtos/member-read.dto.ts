import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
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

  // TODO: Relation with borrowing or book table
}
