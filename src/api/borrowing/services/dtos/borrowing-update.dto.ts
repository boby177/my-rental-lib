import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BorrowingUpdateDTO {
  @ApiProperty()
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  memberCode: string;

  @ApiProperty()
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  bookCode: string;
}
