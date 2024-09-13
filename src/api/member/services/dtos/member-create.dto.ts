import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class MemberCreateDTO {
  @ApiProperty()
  @AutoMap()
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty()
  @AutoMap()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => {
    const transformedValue = value.replace(
      /(^\w{1})|(\s+\w{1})/g,
      (name: string) => name.toUpperCase(),
    );
    return transformedValue.replace(/\s+/g, ' ').trim();
  })
  name: string;
}
