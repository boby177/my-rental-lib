import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Paginate, PaginateQuery, PaginatedSwaggerDocs } from 'nestjs-paginate';
import { PaginateResult } from '@common/base';
import { BookService } from '../services/book.service';
import { BookReadDTO } from '../services/dtos/book-read.dto';
import { BookCreateDTO } from '../services/dtos/book-create.dto';
import { BookUpdateDTO } from '../services/dtos/book-update.dto';

@Controller('book')
@ApiBearerAuth()
@ApiTags('Web - Book API')
export class BookController {
  constructor(private readonly book: BookService) {}

  @Get()
  @ApiOperation({ summary: 'Get all data books' })
  @PaginatedSwaggerDocs(BookReadDTO, {
    sortableColumns: ['code', 'author', 'title', 'stock'],
    searchableColumns: ['code', 'author', 'title', 'stock'],
    maxLimit: 9999999,
  })
  async getAllBooks(@Paginate() query: PaginateQuery): Promise<PaginateResult> {
    return await this.book.findAllBooks(query);
  }

  @Get('not-borrowed')
  @ApiOperation({ summary: 'Get books are not borrowed' })
  async getNotBorrowedBooks() {
    return await this.book.getNotBorrowedBooks();
  }

  @Get('borrowed')
  @ApiOperation({ summary: 'Get books are borrowed' })
  async getBorrowedBooks() {
    return await this.book.getBorrowedBooks();
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Get book by id' })
  @ApiResponse({
    status: 200,
    description: 'Successfully get data book',
    type: BookReadDTO,
  })
  async findBookById(@Param('id') id: string) {
    return await this.book.findById(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get book by code' })
  @ApiResponse({
    status: 200,
    description: 'Successfully get data book',
    type: BookReadDTO,
  })
  async findBookByCode(@Param('code') code: string) {
    return await this.book.findByCode(code);
  }

  @Post('add')
  @ApiOperation({ summary: 'Create new data book' })
  @ApiBody({ type: BookCreateDTO })
  @ApiResponse({
    status: 201,
    description: 'New data book has been created',
    type: BookReadDTO,
  })
  async addNewBook(@Body() bookCreateDTO: BookCreateDTO) {
    return await this.book.addNewBook(bookCreateDTO);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update data book' })
  @ApiBody({ type: BookUpdateDTO })
  @ApiResponse({
    status: 200,
    description: 'Data book has been updated',
    type: BookReadDTO,
  })
  async updateBook(
    @Param('id') id: string,
    @Body() bookUpdateDTO: BookUpdateDTO,
  ) {
    return await this.book.updateBook(id, bookUpdateDTO);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete data book' })
  @ApiResponse({
    status: 200,
    description: 'Data book has been deleted',
  })
  async deleteBook(@Param('id') id: string) {
    return await this.book.deleteBook(id);
  }
}
