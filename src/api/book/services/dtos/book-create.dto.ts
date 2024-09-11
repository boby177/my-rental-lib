import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BookCreateDTO {
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
  title: string;

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
  author: string;

  @ApiProperty()
  @AutoMap()
  @IsNotEmpty()
  @IsNumber()
  stock: number;
}
