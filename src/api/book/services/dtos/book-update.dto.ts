import { PartialType } from '@nestjs/swagger';
import { BookCreateDTO } from './book-create.dto';

export class BookUpdateDTO extends PartialType(BookCreateDTO) {}
