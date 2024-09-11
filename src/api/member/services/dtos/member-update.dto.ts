import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MemberUpdateDTO {
  @ApiProperty()
  @AutoMap()
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty()
  @AutoMap()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    const transformedValue = value.replace(
      /(^\w{1})|(\s+\w{1})/g,
      (name: string) => name.toUpperCase(),
    );
    return transformedValue.replace(/\s+/g, ' ').trim();
  })
  name: string;

  @ApiProperty()
  @AutoMap()
  @IsOptional()
  @IsBoolean()
  isPenalized: boolean;
}
